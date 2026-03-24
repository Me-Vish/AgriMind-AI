import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const getDashboardSummary = () =>
  api.get('/dashboard/summary').then(r => r.data)

export const getMarketTrends = () =>
  api.get('/dashboard/market-trends').then(r => r.data)

// ─── Crop Prediction ──────────────────────────────────────────────────────────
export interface CropPredictionInput {
  nitrogen: number
  phosphorus: number
  potassium: number
  temperature: number
  humidity: number
  ph: number
  rainfall: number
  soil_type?: string
  season?: string
  language?: string
}

export const predictCrop = (data: CropPredictionInput) =>
  api.post('/predict-crop', data).then(r => r.data)

// ─── Disease Detection ────────────────────────────────────────────────────────
export const detectDisease = (file: File, language = 'en') => {
  const form = new FormData()
  form.append('file', file)
  form.append('language', language)
  return api.post('/detect-disease', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data)
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
export interface ChatMessage { role: 'user' | 'assistant'; content: string }

export const sendChatMessage = (
  message: string,
  history: ChatMessage[],
  language = 'en'
) =>
  api.post('/chat', { message, history, language }).then(r => r.data)

// ─── Voice ────────────────────────────────────────────────────────────────────
export const transcribeAudio = (file: File, language = 'en') => {
  const form = new FormData()
  form.append('file', file)
  form.append('language', language)
  return api.post('/voice/transcribe', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data)
}

export const synthesizeSpeech = (text: string, language = 'en') => {
  const form = new FormData()
  form.append('text', text)
  form.append('language', language)
  return api.post('/voice/synthesize', form, {
    responseType: 'blob',
  }).then(r => r.data)
}

export default api
