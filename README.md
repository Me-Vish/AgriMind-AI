# AgriMind AI

AgriMind AI is an intelligent farming assistant project built with **FastAPI** and **React**.

## Project Path

The application source is located here:

`Downloads/agrimind-ai/agrimind`

## Main Features

- Crop prediction from soil and climate inputs
- Disease detection from plant images
- Chat assistant for farming questions
- Irrigation planner
- Market insights dashboard
- Multilingual support
- Downloadable result summaries

## Run the Project

### Backend

```powershell
cd Downloads/agrimind-ai/agrimind/backend
C:\Users\Visha\AppData\Local\Programs\Python\Python313\python.exe -m venv venv
.\venv\Scripts\Activate.ps1
C:\Users\Visha\AppData\Local\Programs\Python\Python313\python.exe -m pip install -r requirements.txt
C:\Users\Visha\AppData\Local\Programs\Python\Python313\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend

```powershell
cd Downloads/agrimind-ai/agrimind/frontend
cmd /c npm install
cmd /c npm run dev -- --host 127.0.0.1 --port 3000
```

## Open in Browser

- Frontend: `http://127.0.0.1:3000`
- Backend: `http://127.0.0.1:8000`
- API Docs: `http://127.0.0.1:8000/api/docs`
