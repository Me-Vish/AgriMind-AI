#!/bin/bash
# AgriMind AI — Automated Setup Script

set -e

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║       AgriMind AI — Project Setup          ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check prerequisites
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3.9+ required"; exit 1; }
command -v node >/dev/null 2>&1    || { echo "❌ Node.js 18+ required"; exit 1; }
command -v npm >/dev/null 2>&1     || { echo "❌ npm required"; exit 1; }

echo "✓ Prerequisites OK"
echo ""

# ── BACKEND ─────────────────────────────────────
echo "1/4  Setting up Python backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --quiet --upgrade pip
pip install --quiet -r requirements.txt

# Environment file
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "    ⚠  Created .env — add your API key to enable AI features"
fi

# Create directories
mkdir -p uploads models rag data

# Build RAG index
echo "    Building RAG knowledge base..."
python rag/build_index.py

# Optional: train synthetic crop model
echo "    Training crop prediction model (synthetic)..."
python models/train_crop_model.py

deactivate
cd ..
echo "    ✓ Backend setup complete"
echo ""

# ── FRONTEND ────────────────────────────────────
echo "2/4  Setting up React frontend..."
cd frontend
npm install --silent
cd ..
echo "    ✓ Frontend setup complete"
echo ""

# ── DONE ────────────────────────────────────────
echo "3/4  Setup complete!"
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║           Start AgriMind AI               ║"
echo "╠════════════════════════════════════════════╣"
echo "║                                            ║"
echo "║  Terminal 1 (Backend):                     ║"
echo "║    cd backend                              ║"
echo "║    source venv/bin/activate                ║"
echo "║    uvicorn main:app --reload               ║"
echo "║                                            ║"
echo "║  Terminal 2 (Frontend):                    ║"
echo "║    cd frontend                             ║"
echo "║    npm run dev                             ║"
echo "║                                            ║"
echo "║  Open: http://localhost:3000               ║"
echo "║  API:  http://localhost:8000/api/docs      ║"
echo "║                                            ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "To enable AI chat: edit backend/.env and add GEMINI_API_KEY"
echo "Get free key at: https://aistudio.google.com/app/apikey"
echo ""
