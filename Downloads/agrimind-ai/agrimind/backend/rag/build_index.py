"""
AgriMind AI - RAG Index Builder
Run this script once to build the FAISS index from the knowledge base.

Usage:
    python rag/build_index.py
"""

import os
import json
import pickle

# Agricultural knowledge documents
DOCUMENTS = [
    {
        "id": "soil_prep_001",
        "title": "Soil Preparation Best Practices",
        "content": "Before planting, conduct soil testing to determine pH and nutrient levels. Most crops prefer a pH of 6.0-7.5. Add lime to raise pH or sulfur to lower it. Incorporate organic matter such as compost at 10-15 tonnes/ha to improve soil structure. Deep plough to 20-25 cm before first crop. Use rotavator or disc harrow for secondary tillage.",
        "category": "soil_management",
        "crops": ["all"]
    },
    {
        "id": "soil_fert_001",
        "title": "Soil Fertility Management",
        "content": "NPK application should be based on soil test results. Basal application of phosphorus and potassium before sowing. Nitrogen in splits - 50% basal and 50% as top dressing at 30-40 DAS. Micronutrients like zinc (ZnSO4 at 25 kg/ha) important in zinc-deficient soils. Organic carbon above 0.5% is considered adequate.",
        "category": "soil_management",
        "crops": ["all"]
    },
    {
        "id": "rice_cult_001",
        "title": "Rice Cultivation Guide",
        "content": "Rice (Oryza sativa) requires transplanting in flooded fields. Optimum temperature 20-35°C. pH 5.5-7.0 ideal. Seed rate: 25 kg/ha for transplanting. Nursery period: 25-30 days. Apply Urea at 120 kg/ha in 3 splits. Critical irrigation stages: active tillering, panicle initiation, flowering, and grain filling. Harvest at 85-90% maturity.",
        "category": "crop_management",
        "crops": ["rice"]
    },
    {
        "id": "wheat_cult_001",
        "title": "Wheat Cultivation Guide",
        "content": "Wheat (Triticum aestivum) is a Rabi crop sown in October-November. Optimum temperature 12-25°C. Seed rate: 100-125 kg/ha. Apply basal NPK as 60:30:30 kg/ha. Critical irrigation stages: crown root initiation (21 DAS), tillering (45 DAS), jointing (65 DAS), flowering (85 DAS), and grain filling (105 DAS). Harvest when grain moisture reaches 12-14%.",
        "category": "crop_management",
        "crops": ["wheat"]
    },
    {
        "id": "cotton_cult_001",
        "title": "Cotton Cultivation Guide",
        "content": "Cotton (Gossypium hirsutum) grows best in black cotton soil (Vertisols). Temperature: 21-35°C. Seed rate: 2-3 kg/ha (Bt hybrid). Spacing: 90x60 cm. NPK: 120:60:60 kg/ha. Critical stages: square formation, flowering, and boll development need adequate moisture. Pest monitoring for bollworm is essential. Harvest: 150-180 DAS.",
        "category": "crop_management",
        "crops": ["cotton"]
    },
    {
        "id": "ipm_001",
        "title": "Integrated Pest Management",
        "content": "IPM combines cultural, mechanical, biological, and chemical methods. Monitor crops weekly using sticky traps and visual inspection. Economic Threshold Levels (ETL) guide chemical interventions. Prefer biopesticides: Bacillus thuringiensis (Bt), NPV, neem-based products. Chemical pesticides as last resort. Rotate pesticide groups to prevent resistance. Maintain buffer zones near water bodies.",
        "category": "pest_management",
        "crops": ["all"]
    },
    {
        "id": "disease_mgmt_001",
        "title": "Plant Disease Management",
        "content": "Common rice diseases: Blast (Magnaporthe oryzae) - apply Tricyclazole; Brown Spot (Bipolaris oryzae) - apply Mancozeb; Bacterial Leaf Blight - apply copper bactericides. Wheat diseases: Rust (Puccinia) - apply Propiconazole; Powdery mildew - apply Hexaconazole. Spray fungicides at first sign of disease. Remove and destroy infected plant material.",
        "category": "pest_management",
        "crops": ["rice", "wheat"]
    },
    {
        "id": "irrigation_001",
        "title": "Irrigation Management",
        "content": "Irrigation scheduling depends on crop stage, soil type, and climate. Drip irrigation saves 30-50% water versus flood irrigation. Sprinkler irrigation suitable for uneven terrain. Soil moisture sensors improve scheduling efficiency. Critical irrigation periods vary by crop. Avoid waterlogging - leads to root rot and anaerobic conditions.",
        "category": "water_management",
        "crops": ["all"]
    },
    {
        "id": "crop_rotation_001",
        "title": "Crop Rotation Principles",
        "content": "Rotating crops prevents soil nutrient depletion and breaks pest cycles. Alternate cereals (rice, wheat, maize) with legumes (soybean, pulses). Legumes fix atmospheric nitrogen, reducing fertilizer requirements by 20-30 kg N/ha for subsequent crop. Green manure crops like Dhaincha improve organic matter. Include a fallow or cover crop where feasible.",
        "category": "agronomy",
        "crops": ["all"]
    },
    {
        "id": "market_001",
        "title": "Agricultural Marketing",
        "content": "MSP (Minimum Support Price) is announced by Government of India before each season. APMC (Agricultural Produce Market Committee) regulates local mandis. e-NAM (National Agriculture Market) is a pan-India online trading portal. FPOs (Farmer Producer Organisations) enable collective bargaining. Direct marketing through contract farming reduces middlemen.",
        "category": "marketing",
        "crops": ["all"]
    },
    {
        "id": "organic_001",
        "title": "Organic Farming Practices",
        "content": "Organic farming avoids synthetic inputs. Use FYM at 15-20 t/ha, vermicompost at 4-5 t/ha. Biofertilizers: Rhizobium for legumes, Azospirillum for non-legumes, PSB (Phosphate Solubilizing Bacteria), KSB (Potassium Solubilizing Bacteria). Biopesticides: Neem oil 3%, Bt, Beauveria bassiana. NPOP certification required for export markets.",
        "category": "organic_farming",
        "crops": ["all"]
    },
    {
        "id": "weather_001",
        "title": "Weather Impact on Crops",
        "content": "Temperature, rainfall, and humidity directly affect crop growth and yield. Frost damages crops below 2°C - use anti-transpirants and foggers. Heat stress above 35°C reduces pollen viability and grain filling. Excessive rainfall causes waterlogging and foliar diseases. Drought stress: apply mulching and deficit irrigation. Monitor IMD forecasts for advance planning.",
        "category": "climate",
        "crops": ["all"]
    },
    {
        "id": "govt_schemes_001",
        "title": "Government Agricultural Schemes",
        "content": "Key schemes: PM-KISAN (₹6000/year income support), PMFBY (crop insurance), PM Krishi Sinchai Yojana (irrigation), Soil Health Card scheme, Kisan Credit Card (KCC) for crop loans at 4% interest, PM Fasal Bima Yojana. National Food Security Mission targets rice, wheat, pulses and coarse cereals. Contact local KRISHI VIGYAN KENDRA (KVK) for scheme details.",
        "category": "policy",
        "crops": ["all"]
    },
]


def build_simple_index():
    """Build a simple keyword index (fallback without FAISS/sentence-transformers)"""
    index = {
        "documents": DOCUMENTS,
        "keyword_map": {}
    }

    for doc in DOCUMENTS:
        words = doc["content"].lower().split()
        for word in set(words):
            if len(word) > 4:
                if word not in index["keyword_map"]:
                    index["keyword_map"][word] = []
                index["keyword_map"][word].append(doc["id"])

    os.makedirs("rag", exist_ok=True)
    with open("rag/simple_index.pkl", "wb") as f:
        pickle.dump(index, f)

    print(f"✓ Simple index built: {len(DOCUMENTS)} documents indexed")
    return index


def build_faiss_index():
    """Build FAISS vector index with sentence embeddings"""
    try:
        from sentence_transformers import SentenceTransformer
        import faiss
        import numpy as np

        print("Loading sentence transformer model...")
        model = SentenceTransformer("all-MiniLM-L6-v2")

        texts = [f"{d['title']}. {d['content']}" for d in DOCUMENTS]
        print(f"Encoding {len(texts)} documents...")
        embeddings = model.encode(texts, show_progress_bar=True)

        dimension = embeddings.shape[1]
        index = faiss.IndexFlatL2(dimension)
        index.add(embeddings.astype("float32"))

        os.makedirs("rag", exist_ok=True)
        faiss.write_index(index, "rag/faiss_index.bin")

        metadata = {
            "documents": DOCUMENTS,
            "dimension": dimension,
            "count": len(DOCUMENTS)
        }
        with open("rag/metadata.json", "w") as f:
            json.dump(metadata, f, indent=2)

        print(f"✓ FAISS index built: {len(DOCUMENTS)} documents, {dimension}D embeddings")
        return index

    except ImportError as e:
        print(f"FAISS/SentenceTransformers not available ({e}), building simple index...")
        return build_simple_index()


if __name__ == "__main__":
    print("AgriMind AI — Building RAG knowledge base index...\n")
    build_faiss_index()
    print("\nIndex files saved to rag/ directory.")
    print("Restart the backend server to use the new index.")
