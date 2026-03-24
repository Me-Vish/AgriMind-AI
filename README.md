# 🌱 AgriMind AI — Intelligent Farming Assistant

AgriMind AI is a full-stack, AI-powered agriculture platform designed to help farmers and agricultural teams make smarter, data-driven decisions.

The system brings together crop recommendation, disease detection, conversational assistance, and market insights into a single unified interface.

---

##  Live Demo

* 🔗 Frontend: https://agri-mind-ai.vercel.app
* 🔗 Backend API: https://agrimind-ai.onrender.com
* 📄 API Docs: https://agrimind-ai.onrender.com/api/docs

---

##  Overview

AgriMind AI acts as a digital assistant for farming by analyzing soil data, plant conditions, and environmental factors to provide actionable insights.

Instead of relying on multiple tools, users can access all key agricultural intelligence features in one place.

---

##  Key Features

* 🌾 **Crop Prediction**
  Recommends suitable crops based on soil nutrients, pH, rainfall, and climate conditions.

* 🦠 **Disease Detection**
  Detects plant diseases from leaf images and provides treatment suggestions.

* 💬 **AI Chat Assistant**
  Answers agriculture-related queries using an intelligent chatbot.

* 💧 **Irrigation Planning**
  Suggests optimal watering strategies based on conditions.

* 📊 **Market Insights**
  Displays crop price trends and agricultural market data.

* 🌍 **Multilingual Support**
  Supports English, Tamil, and Hindi for better accessibility.

* 📄 **Downloadable Reports**
  Users can export prediction and analysis results.

---

##  Tech Stack

### Frontend

* React 18
* TypeScript
* Vite
* Tailwind CSS
* Axios
* Recharts

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic

### AI / ML

* Random Forest (Crop Prediction)
* CNN-based workflow (Disease Detection)
* RAG-ready Chat System
* Multilingual + Voice-ready architecture

---

##  Project Structure

```
AgriMind-AI/
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── rag/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
```

---

##  Local Setup

###  Backend Setup

```bash
cd backend

python -m venv venv
venv\Scripts\activate     # Windows

pip install -r requirements.txt

uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

---

###  Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

---

##  Run Locally

* Frontend: http://127.0.0.1:3000
* Backend: http://127.0.0.1:8000
* API Docs: http://127.0.0.1:8000/api/docs

---

##  Authentication

The application includes a clean, professional sign-in experience with Google authentication (in progress for production-level integration).

---

##  Future Improvements

* Real-time weather API integration
* Live market data sources
* Production-grade ML models
* Farmer history and analytics dashboard
* Role-based access (admin/user)

---

##  Conclusion

AgriMind AI demonstrates a complete, scalable approach to building real-world AI systems by combining machine learning, backend services, and a modern frontend into a unified platform.

It is designed not just as a project, but as a foundation for a production-ready agricultural intelligence system.

---

##  Author

**Vishali M**
AI & ML Developer | Full-Stack Enthusiast

---

⭐ If you found this project useful, consider giving it a star!
