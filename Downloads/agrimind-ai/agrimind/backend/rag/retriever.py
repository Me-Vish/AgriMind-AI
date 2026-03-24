"""
AgriMind AI - RAG Retriever
Semantic search over agricultural knowledge base using FAISS
"""

import os
import json
import pickle
from typing import List, Dict


class RAGRetriever:
    """
    Retrieval-Augmented Generation system for agricultural knowledge.
    Falls back gracefully from FAISS → simple keyword index → hardcoded fallback.
    """

    def __init__(self):
        self.faiss_index = None
        self.faiss_model = None
        self.documents: List[Dict] = []
        self.keyword_map: Dict = {}
        self._load_index()

    def _load_index(self):
        """Load FAISS index or fall back to simple keyword index"""
        faiss_path = os.environ.get("RAG_INDEX_PATH", "rag/faiss_index.bin")
        metadata_path = "rag/metadata.json"
        simple_path = "rag/simple_index.pkl"

        # Try FAISS first
        if os.path.exists(faiss_path) and os.path.exists(metadata_path):
            try:
                import faiss
                from sentence_transformers import SentenceTransformer

                self.faiss_index = faiss.read_index(faiss_path)
                with open(metadata_path) as f:
                    meta = json.load(f)
                self.documents = meta["documents"]
                self.faiss_model = SentenceTransformer("all-MiniLM-L6-v2")
                print("✓ RAG: FAISS index loaded")
                return
            except Exception as e:
                print(f"FAISS load failed ({e}), trying simple index...")

        # Try simple keyword index
        if os.path.exists(simple_path):
            try:
                with open(simple_path, "rb") as f:
                    data = pickle.load(f)
                self.documents = data["documents"]
                self.keyword_map = data["keyword_map"]
                print("✓ RAG: Simple keyword index loaded")
                return
            except Exception as e:
                print(f"Simple index load failed ({e}), using inline fallback")

        # Inline fallback - import from build_index
        try:
            from rag.build_index import DOCUMENTS
            self.documents = DOCUMENTS
            # Build in-memory keyword map
            for doc in self.documents:
                for word in set(doc["content"].lower().split()):
                    if len(word) > 4:
                        if word not in self.keyword_map:
                            self.keyword_map[word] = []
                        self.keyword_map[word].append(doc["id"])
            print("✓ RAG: In-memory fallback index ready")
        except Exception:
            self.documents = []
            print("⚠ RAG: No index available")

    def retrieve(self, query: str, top_k: int = 3) -> List[Dict]:
        """
        Retrieve top-k relevant documents for a query.
        Uses FAISS semantic search or keyword fallback.
        """
        if not self.documents:
            return []

        # FAISS semantic search
        if self.faiss_index is not None and self.faiss_model is not None:
            return self._faiss_search(query, top_k)

        # Keyword search fallback
        return self._keyword_search(query, top_k)

    def _faiss_search(self, query: str, top_k: int) -> List[Dict]:
        """Semantic search using FAISS"""
        import numpy as np
        try:
            query_embedding = self.faiss_model.encode([query])
            distances, indices = self.faiss_index.search(
                query_embedding.astype("float32"), top_k
            )
            results = []
            for idx in indices[0]:
                if 0 <= idx < len(self.documents):
                    results.append(self.documents[idx])
            return results
        except Exception:
            return self._keyword_search(query, top_k)

    def _keyword_search(self, query: str, top_k: int) -> List[Dict]:
        """Simple keyword-based document retrieval"""
        query_words = set(query.lower().split())
        doc_scores: Dict[str, int] = {}

        for word in query_words:
            if len(word) <= 3:
                continue
            # Exact match
            if word in self.keyword_map:
                for doc_id in self.keyword_map[word]:
                    doc_scores[doc_id] = doc_scores.get(doc_id, 0) + 2
            # Prefix match
            for key in self.keyword_map:
                if key.startswith(word[:4]) and key != word:
                    for doc_id in self.keyword_map[key]:
                        doc_scores[doc_id] = doc_scores.get(doc_id, 0) + 1

        if not doc_scores:
            # Return first few documents as general context
            return self.documents[:top_k]

        sorted_docs = sorted(doc_scores.items(), key=lambda x: x[1], reverse=True)
        doc_map = {d["id"]: d for d in self.documents}
        return [doc_map[did] for did, _ in sorted_docs[:top_k] if did in doc_map]

    def format_context(self, documents: List[Dict]) -> str:
        """Format retrieved documents into a context string for the LLM"""
        if not documents:
            return "No specific knowledge base context available."

        parts = []
        for doc in documents:
            parts.append(f"[{doc['title']}]\n{doc['content']}")

        return "\n\n".join(parts)

    def retrieve_formatted(self, query: str, top_k: int = 3) -> str:
        """Retrieve and format context in one call"""
        docs = self.retrieve(query, top_k)
        return self.format_context(docs)


# Singleton instance
_retriever_instance = None


def get_retriever() -> RAGRetriever:
    global _retriever_instance
    if _retriever_instance is None:
        _retriever_instance = RAGRetriever()
    return _retriever_instance
