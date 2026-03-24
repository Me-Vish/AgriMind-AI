# AgriMind AI — Intelligent Farming Assistant

> Enterprise-grade agricultural intelligence platform built with FastAPI + React

---

## Project Structure

```
agrimind/
├── backend/
│   ├── main.py                    # FastAPI application entry point
│   ├── requirements.txt
│   ├── .env.example               # Copy to .env and configure
│   ├── routes/
│   │   ├── dashboard.py           # Dashboard aggregation endpoints
│   │   ├── crop.py                # POST /api/predict-crop
│   │   ├── disease.py             # POST /api/detect-disease
│   │   ├── chat.py                # POST /api/chat
│   │   └── voice.py               # POST /api/voice/transcribe & /synthesize
│   ├── services/
│   │   ├── crop_service.py        # Random Forest crop prediction logic
│   │   ├── disease_service.py     # CNN disease detection logic
│   │   ├── chat_service.py        # RAG + Gemini/OpenAI chat logic
│   │   ├── voice_service.py       # STT + TTS services
│   │   ├── translation_service.py # Multilingual support (EN/TA/HI)
│   │   ├── weather_service.py     # Weather data provider
│   │   └── market_service.py      # Market data provider
│   ├── models/                    # ML model files (place .pkl/.pt here)
│   ├── rag/                       # FAISS index and document store
│   ├── uploads/                   # Auto-created for file uploads
│   └── utils/
│
└── frontend/
    ├── index.html
    ├── vite.config.ts
    ├── package.json
    ├── tsconfig.json
    └── src/
        ├── main.tsx
        ├── App.tsx                # Router setup
        ├── index.css              # Design system / global styles
        ├── components/
        │   └── layout/
        │       ├── Layout.tsx     # Shell with sidebar + topbar
        │       ├── Sidebar.tsx    # Fixed left navigation
        │       └── Topbar.tsx     # Header with language/theme toggle
        ├── pages/
        │   ├── Dashboard.tsx      # Main overview with charts and stats
        │   ├── CropPrediction.tsx # Form + results table
        │   ├── DiseaseDetection.tsx # Upload + diagnosis results
        │   ├── ChatAssistant.tsx  # Multi-turn chat interface
        │   └── MarketInsights.tsx # Market tables and price charts
        ├── services/
        │   └── api.ts             # Axios client + all API calls
        └── hooks/
            └── useTheme.tsx       # Light/dark mode context
```

---

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — add your Gemini or OpenAI API key

# Create required directories
mkdir -p models rag uploads

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

API will be available at: **http://localhost:8000**
Swagger docs: **http://localhost:8000/api/docs**

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

---

## AI Configuration

The platform works out-of-the-box in **demo mode** (rule-based responses) with no API key required.

For full AI capabilities, configure `.env`:

```env
# Option A: Google Gemini (recommended, free tier available)
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key

# Option B: OpenAI GPT
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
```

Get a Gemini API key at: https://aistudio.google.com/app/apikey

---

## ML Models

The platform uses **rule-based fallback** when model files are not present:

### Adding a Crop Prediction Model (Random Forest)

```python
# train_crop_model.py
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

df = pd.read_csv('data/crop_recommendation.csv')  # Kaggle: Crop Recommendation Dataset
le = LabelEncoder()
df['label_enc'] = le.fit_transform(df['label'])

X = df[['N','P','K','temperature','humidity','ph','rainfall']]
y = df['label_enc']

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)
joblib.dump({'model': model, 'encoder': le}, 'backend/models/crop_model.pkl')
```

### Adding a Disease Detection Model (CNN/MobileNet)

Place your trained PyTorch model at `backend/models/disease_model.pt`

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/health` | Health check |
| GET  | `/api/dashboard/summary` | Dashboard data |
| GET  | `/api/dashboard/market-trends` | Price trend data |
| POST | `/api/predict-crop` | Crop prediction (JSON body) |
| POST | `/api/detect-disease` | Disease detection (multipart) |
| POST | `/api/chat` | Chat message (JSON body) |
| POST | `/api/voice/transcribe` | Audio to text (multipart) |
| POST | `/api/voice/synthesize` | Text to audio (form data) |

### Crop Prediction Payload

```json
{
  "nitrogen": 42,
  "phosphorus": 18,
  "potassium": 205,
  "temperature": 29.5,
  "humidity": 71,
  "ph": 6.8,
  "rainfall": 1200,
  "soil_type": "alluvial",
  "season": "kharif",
  "language": "en"
}
```

---

## Features

| Feature | Status | Technology |
|---------|--------|------------|
| Crop Prediction | ✅ Rule-based + ML | Random Forest / sklearn |
| Disease Detection | ✅ Heuristic + CNN | MobileNet / PyTorch |
| RAG Chatbot | ✅ Knowledge base + LLM | FAISS + Gemini/OpenAI |
| Multilingual | ✅ EN / TA / HI | deep-translator + gTTS |
| Voice Input | ✅ Browser MediaRecorder | Web Speech API |
| Voice Output | ✅ Text-to-Speech | gTTS |
| Dark Mode | ✅ CSS Variables | React Context |
| Market Data | ✅ Static + extendable | API ready for e-NAM |

---

## Production Deployment

### Backend (Gunicorn + Nginx)

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend (Build)

```bash
cd frontend
npm run build
# Serve the dist/ folder via Nginx or any static host
```

---

## Tech Stack

**Backend:** Python 3.11+ · FastAPI · Uvicorn · scikit-learn · PyTorch · FAISS · Sentence Transformers · gTTS · LangChain · Pydantic v2

**Frontend:** React 18 · TypeScript · Vite · React Router v6 · Recharts · Lucide React · Axios

**AI:** Google Gemini / OpenAI GPT-3.5 · Random Forest · MobileNetV2 · RAG with FAISS

---

## License

MIT License — Free for academic, personal, and commercial use.

---

*Built with precision for enterprise agricultural intelligence.*
