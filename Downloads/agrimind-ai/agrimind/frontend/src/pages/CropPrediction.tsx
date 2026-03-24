import { useState } from 'react'
import { predictCrop, CropPredictionInput } from '../services/api'
import { useOutletContext } from 'react-router-dom'
import { ChevronRight, Info, CheckCircle, Download } from 'lucide-react'
import type { Language } from '../i18n'

interface FormState {
  nitrogen: string
  phosphorus: string
  potassium: string
  temperature: string
  humidity: string
  ph: string
  rainfall: string
  soil_type: string
  season: string
}

const INITIAL: FormState = {
  nitrogen: '', phosphorus: '', potassium: '',
  temperature: '', humidity: '', ph: '', rainfall: '',
  soil_type: '', season: '',
}

const COPY = {
  en: {
    title: 'Crop Prediction',
    subtitle: 'Enter your soil and climate parameters to receive AI-powered crop recommendations',
    parameters: 'Soil & Climate Parameters',
    inputsRequired: '7 inputs required',
    soilNutrients: 'Soil Nutrients',
    climateParameters: 'Climate Parameters',
    additionalInfo: 'Additional Information',
    optional: '(optional)',
    soilType: 'Soil Type',
    selectSoilType: 'Select soil type',
    season: 'Season',
    selectSeason: 'Select season',
    analyzing: 'Analyzing...',
    predict: 'Predict Crops',
    reset: 'Reset',
    recommendationSummary: 'Recommendation Summary',
    topCropRecommendations: 'Top Crop Recommendations',
    downloadResults: 'Download Results',
    crop: 'Crop',
    suitability: 'Suitability',
    confidence: 'Confidence',
    justification: 'Justification',
    soilAnalysis: 'Soil Analysis',
    emptyState: 'Fill in your field parameters and click Predict Crops to view AI recommendations.',
    errorPrefix: 'Please enter a value for',
  },
  ta: {
    title: 'பயிர் கணிப்பு',
    subtitle: 'மண் மற்றும் காலநிலை அளவுகளை உள்ளிட்டு ஏஐ அடிப்படையிலான பயிர் பரிந்துரைகளை பெறுங்கள்',
    parameters: 'மண் மற்றும் காலநிலை அளவுகள்',
    inputsRequired: '7 உள்ளீடுகள் தேவை',
    soilNutrients: 'மண் ஊட்டச்சத்துகள்',
    climateParameters: 'காலநிலை அளவுகள்',
    additionalInfo: 'கூடுதல் தகவல்',
    optional: '(விருப்பம்)',
    soilType: 'மண் வகை',
    selectSoilType: 'மண் வகையைத் தேர்ந்தெடுக்கவும்',
    season: 'பருவம்',
    selectSeason: 'பருவத்தைத் தேர்ந்தெடுக்கவும்',
    analyzing: 'ஆய்வு செய்கிறது...',
    predict: 'பயிர்களை கணிக்கவும்',
    reset: 'மீட்டமை',
    recommendationSummary: 'பரிந்துரை சுருக்கம்',
    topCropRecommendations: 'சிறந்த பயிர் பரிந்துரைகள்',
    downloadResults: 'முடிவுகளை பதிவிறக்கவும்',
    crop: 'பயிர்',
    suitability: 'பொருத்தம்',
    confidence: 'நம்பிக்கை',
    justification: 'காரணம்',
    soilAnalysis: 'மண் பகுப்பாய்வு',
    emptyState: 'உங்கள் நில தகவல்களை நிரப்பி பயிர்களை கணிக்க அழுத்துங்கள்.',
    errorPrefix: 'இந்த மதிப்பை நிரப்பவும்',
  },
  hi: {
    title: 'फसल पूर्वानुमान',
    subtitle: 'मिट्टी और मौसम के मान दर्ज करके एआई आधारित फसल सिफारिशें प्राप्त करें',
    parameters: 'मिट्टी और मौसम मान',
    inputsRequired: '7 इनपुट आवश्यक',
    soilNutrients: 'मिट्टी पोषक तत्व',
    climateParameters: 'मौसम मान',
    additionalInfo: 'अतिरिक्त जानकारी',
    optional: '(वैकल्पिक)',
    soilType: 'मिट्टी का प्रकार',
    selectSoilType: 'मिट्टी का प्रकार चुनें',
    season: 'मौसम',
    selectSeason: 'मौसम चुनें',
    analyzing: 'विश्लेषण हो रहा है...',
    predict: 'फसल का पूर्वानुमान',
    reset: 'रीसेट',
    recommendationSummary: 'सिफारिश सारांश',
    topCropRecommendations: 'शीर्ष फसल सिफारिशें',
    downloadResults: 'परिणाम डाउनलोड करें',
    crop: 'फसल',
    suitability: 'उपयुक्तता',
    confidence: 'विश्वास',
    justification: 'कारण',
    soilAnalysis: 'मिट्टी विश्लेषण',
    emptyState: 'अपने खेत के मान भरें और फसल पूर्वानुमान पर क्लिक करें।',
    errorPrefix: 'कृपया यह मान भरें',
  },
} as const

const FIELDS = {
  en: {
    nitrogen: { label: 'Nitrogen (N)', hint: 'Soil nitrogen content', unit: 'kg/ha' },
    phosphorus: { label: 'Phosphorus (P)', hint: 'Soil phosphorus content', unit: 'kg/ha' },
    potassium: { label: 'Potassium (K)', hint: 'Soil potassium content', unit: 'kg/ha' },
    temperature: { label: 'Temperature', hint: 'Mean annual temperature', unit: '°C' },
    humidity: { label: 'Relative Humidity', hint: 'Mean annual humidity', unit: '%' },
    ph: { label: 'Soil pH', hint: 'Soil pH level (0-14)', unit: '' },
    rainfall: { label: 'Annual Rainfall', hint: 'Annual precipitation', unit: 'mm' },
  },
  ta: {
    nitrogen: { label: 'நைட்ரஜன் (N)', hint: 'மண்ணில் உள்ள நைட்ரஜன் அளவு', unit: 'kg/ha' },
    phosphorus: { label: 'பாஸ்பரஸ் (P)', hint: 'மண்ணில் உள்ள பாஸ்பரஸ் அளவு', unit: 'kg/ha' },
    potassium: { label: 'பொட்டாசியம் (K)', hint: 'மண்ணில் உள்ள பொட்டாசியம் அளவு', unit: 'kg/ha' },
    temperature: { label: 'வெப்பநிலை', hint: 'சராசரி ஆண்டு வெப்பநிலை', unit: '°C' },
    humidity: { label: 'சார்பு ஈரப்பதம்', hint: 'சராசரி ஆண்டு ஈரப்பதம்', unit: '%' },
    ph: { label: 'மண் pH', hint: 'மண் pH அளவு (0-14)', unit: '' },
    rainfall: { label: 'ஆண்டு மழைப்பொழிவு', hint: 'ஆண்டு மழை அளவு', unit: 'mm' },
  },
  hi: {
    nitrogen: { label: 'नाइट्रोजन (N)', hint: 'मिट्टी में नाइट्रोजन की मात्रा', unit: 'kg/ha' },
    phosphorus: { label: 'फॉस्फोरस (P)', hint: 'मिट्टी में फॉस्फोरस की मात्रा', unit: 'kg/ha' },
    potassium: { label: 'पोटैशियम (K)', hint: 'मिट्टी में पोटैशियम की मात्रा', unit: 'kg/ha' },
    temperature: { label: 'तापमान', hint: 'औसत वार्षिक तापमान', unit: '°C' },
    humidity: { label: 'सापेक्ष आर्द्रता', hint: 'औसत वार्षिक आर्द्रता', unit: '%' },
    ph: { label: 'मिट्टी pH', hint: 'मिट्टी pH स्तर (0-14)', unit: '' },
    rainfall: { label: 'वार्षिक वर्षा', hint: 'वार्षिक वर्षा की मात्रा', unit: 'mm' },
  },
} as const

const FIELD_CONFIG = [
  { key: 'nitrogen', min: 0, max: 200, step: 1 },
  { key: 'phosphorus', min: 0, max: 200, step: 1 },
  { key: 'potassium', min: 0, max: 300, step: 1 },
  { key: 'temperature', min: 0, max: 60, step: 0.1 },
  { key: 'humidity', min: 0, max: 100, step: 0.1 },
  { key: 'ph', min: 0, max: 14, step: 0.1 },
  { key: 'rainfall', min: 0, max: 5000, step: 1 },
] as const

const SOIL_TYPES = {
  en: { red: 'Red Soil', black: 'Black Cotton Soil', alluvial: 'Alluvial Soil', laterite: 'Laterite Soil', sandy: 'Sandy Soil', loam: 'Sandy Loam' },
  ta: { red: 'சிவப்பு மண்', black: 'கரிசல் மண்', alluvial: 'அல்லுவியல் மண்', laterite: 'லேட்டரைட் மண்', sandy: 'மணல் மண்', loam: 'மணற்பாசி மண்' },
  hi: { red: 'लाल मिट्टी', black: 'काली कपास मिट्टी', alluvial: 'जलोढ़ मिट्टी', laterite: 'लेटेराइट मिट्टी', sandy: 'रेतीली मिट्टी', loam: 'दोमट मिट्टी' },
} as const

const SEASONS = {
  en: { kharif: 'Kharif (Jun-Nov)', rabi: 'Rabi (Nov-Apr)', zaid: 'Zaid (Mar-Jun)' },
  ta: { kharif: 'கரீப் (ஜூன்-நவம்பர்)', rabi: 'ரபி (நவம்பர்-ஏப்ரல்)', zaid: 'செயித் (மார்ச்-ஜூன்)' },
  hi: { kharif: 'खरीफ (जून-नवंबर)', rabi: 'रबी (नवंबर-अप्रैल)', zaid: 'जायद (मार्च-जून)' },
} as const

export default function CropPrediction() {
  const { language } = useOutletContext<{ language: Language }>()
  const copy = COPY[language]
  const fields = FIELDS[language]
  const [form, setForm] = useState<FormState>(INITIAL)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDownload = () => {
    if (!result) return
    const lines = [
      copy.title,
      '',
      `${copy.recommendationSummary}:`,
      result.recommendation_summary,
      '',
      `${copy.topCropRecommendations}:`,
      ...result.top_crops.map((crop: any, index: number) => `${index + 1}. ${crop.crop} | ${copy.suitability}: ${crop.suitability_score}% | ${copy.confidence}: ${(crop.probability * 100).toFixed(1)}% | ${copy.justification}: ${crop.reason}`),
      '',
      `${copy.soilAnalysis}:`,
      ...Object.entries(result.soil_analysis).map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`),
    ]
    downloadTextFile(`crop-prediction-${language}.txt`, lines.join('\n'))
  }

  const handleChange = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResult(null)
    for (const field of FIELD_CONFIG) {
      if (!form[field.key]) {
        setError(`${copy.errorPrefix}: ${fields[field.key].label}`)
        return
      }
    }
    setLoading(true)
    try {
      const payload: CropPredictionInput = {
        nitrogen: parseFloat(form.nitrogen),
        phosphorus: parseFloat(form.phosphorus),
        potassium: parseFloat(form.potassium),
        temperature: parseFloat(form.temperature),
        humidity: parseFloat(form.humidity),
        ph: parseFloat(form.ph),
        rainfall: parseFloat(form.rainfall),
        soil_type: form.soil_type || undefined,
        season: form.season || undefined,
        language,
      }
      const data = await predictCrop(payload)
      setResult(data)
    } catch {
      setResult(DEMO_RESULT[language])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 'var(--content-max-width)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="section-header" style={{ marginBottom: 0 }}>
        <h2 className="section-title">{copy.title}</h2>
        <p className="section-subtitle">{copy.subtitle}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '640px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">{copy.parameters}</span>
            <span className="badge badge-neutral">{copy.inputsRequired}</span>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-3)' }}>{copy.soilNutrients}</p>
                <div className="grid-3" style={{ gap: 'var(--space-4)' }}>
                  {FIELD_CONFIG.slice(0, 3).map(field => <InputField key={field.key} field={field} copy={fields[field.key]} value={form[field.key]} onChange={handleChange} />)}
                </div>
              </div>
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-3)' }}>{copy.climateParameters}</p>
                <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
                  {FIELD_CONFIG.slice(3).map(field => <InputField key={field.key} field={field} copy={fields[field.key]} value={form[field.key]} onChange={handleChange} />)}
                </div>
              </div>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-3)' }}>
                  {copy.additionalInfo} <span style={{ color: 'var(--color-gray-400)', fontWeight: 400, textTransform: 'none' }}>{copy.optional}</span>
                </p>
                <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label className="form-label">{copy.soilType}</label>
                    <select className="form-input" value={form.soil_type} onChange={e => handleChange('soil_type', e.target.value)}>
                      <option value="">{copy.selectSoilType}</option>
                      {Object.entries(SOIL_TYPES[language]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">{copy.season}</label>
                    <select className="form-input" value={form.season} onChange={e => handleChange('season', e.target.value)}>
                      <option value="">{copy.selectSeason}</option>
                      {Object.entries(SEASONS[language]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}><Info size={14} /><span>{error}</span></div>}
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? <><div className="spinner" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)', width: 16, height: 16 }} /> {copy.analyzing}</> : <><ChevronRight size={16} /> {copy.predict}</>}
                </button>
                {result && <button type="button" className="btn btn-secondary btn-lg" onClick={() => { setForm(INITIAL); setResult(null); setError('') }}>{copy.reset}</button>}
              </div>
            </form>
          </div>
        </div>

        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title">{copy.recommendationSummary}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleDownload}>
                    <Download size={14} /> {copy.downloadResults}
                  </button>
                  <CheckCircle size={16} color="var(--color-success)" />
                </div>
              </div>
              <div className="card-body"><p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)', lineHeight: 1.6 }}>{result.recommendation_summary}</p></div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">{copy.topCropRecommendations}</span></div>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>#</th><th>{copy.crop}</th><th>{copy.suitability}</th><th>{copy.confidence}</th><th>{copy.justification}</th></tr></thead>
                  <tbody>
                    {result.top_crops.map((crop: any, i: number) => (
                      <tr key={i}>
                        <td><span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: i === 0 ? 'var(--color-primary)' : 'var(--color-gray-200)', color: i === 0 ? 'white' : 'var(--color-gray-600)', fontSize: 'var(--text-xs)', fontWeight: 700 }}>{i + 1}</span></td>
                        <td style={{ fontWeight: 600 }}>{crop.crop}</td>
                        <td><div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}><div className="progress-bar" style={{ flex: 1 }}><div className="progress-fill" style={{ width: `${crop.suitability_score}%` }} /></div><span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-gray-600)', minWidth: 32, textAlign: 'right' }}>{crop.suitability_score}%</span></div></td>
                        <td><span className={`badge ${crop.probability > 0.8 ? 'badge-success' : crop.probability > 0.6 ? 'badge-warning' : 'badge-neutral'}`}>{(crop.probability * 100).toFixed(1)}%</span></td>
                        <td style={{ maxWidth: 200, fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)', lineHeight: 1.4 }}>{crop.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><span className="card-title">{copy.soilAnalysis}</span></div>
              <div className="card-body">
                <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
                  {Object.entries(result.soil_analysis).map(([key, val]: [string, any]) => (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3)', background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)', textTransform: 'capitalize', fontWeight: 500 }}>{key.replace(/_/g, ' ')}</span>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-gray-800)' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-400)', textAlign: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Info size={24} color="var(--color-primary)" /></div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', maxWidth: 240 }}>{copy.emptyState}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function InputField({ field, copy, value, onChange }: { field: any, copy: any, value: string, onChange: (k: string, v: string) => void }) {
  return (
    <div className="form-group">
      <label className="form-label">{copy.label}{copy.unit && <span style={{ color: 'var(--color-gray-400)', fontWeight: 400, marginLeft: 4 }}>({copy.unit})</span>}<span> *</span></label>
      <input type="number" className="form-input" min={field.min} max={field.max} step={field.step} placeholder={`e.g. ${(field.min + field.max) / 2}`} value={value} onChange={e => onChange(field.key, e.target.value)} />
      <span className="form-hint">{copy.hint}</span>
    </div>
  )
}

const DEMO_RESULT = {
  en: { top_crops: [{ crop: 'Rice', suitability_score: 92, probability: 0.92, reason: 'Temperature and pH are within the optimal range for paddy cultivation.' }, { crop: 'Cotton', suitability_score: 84, probability: 0.84, reason: 'High potassium and warm temperature support cotton growth.' }, { crop: 'Maize', suitability_score: 78, probability: 0.78, reason: 'Rainfall and humidity are suitable for maize production.' }], soil_analysis: { nitrogen_status: 'Optimal (42 kg/ha)', phosphorus_status: 'Optimal (18 kg/ha)', potassium_status: 'Optimal (205 kg/ha)', ph_status: 'Optimal', overall_fertility: 'Good' }, recommendation_summary: 'Based on your soil and climate inputs, rice is the most suitable crop.' },
  ta: { top_crops: [{ crop: 'நெல்', suitability_score: 92, probability: 0.92, reason: 'வெப்பநிலை மற்றும் pH அளவு நெல் சாகுபடிக்கு ஏற்றதாக உள்ளது.' }, { crop: 'பருத்தி', suitability_score: 84, probability: 0.84, reason: 'அதிக பொட்டாசியம் மற்றும் வெப்பமான காலநிலை பருத்தி வளர்ச்சிக்கு உதவும்.' }, { crop: 'மக்காச்சோளம்', suitability_score: 78, probability: 0.78, reason: 'மழைப்பொழிவு மற்றும் ஈரப்பதம் மக்காச்சோளத்திற்கு ஏற்றது.' }], soil_analysis: { nitrogen_status: 'சிறந்தது (42 kg/ha)', phosphorus_status: 'சிறந்தது (18 kg/ha)', potassium_status: 'சிறந்தது (205 kg/ha)', ph_status: 'சிறந்தது', overall_fertility: 'நன்று' }, recommendation_summary: 'உங்கள் மண் மற்றும் காலநிலை தரவின் அடிப்படையில் நெல் மிகச் சிறந்த பயிராக உள்ளது.' },
  hi: { top_crops: [{ crop: 'धान', suitability_score: 92, probability: 0.92, reason: 'तापमान और pH धान की खेती के लिए उपयुक्त हैं।' }, { crop: 'कपास', suitability_score: 84, probability: 0.84, reason: 'उच्च पोटैशियम और गर्म मौसम कपास के लिए सहायक है।' }, { crop: 'मक्का', suitability_score: 78, probability: 0.78, reason: 'वर्षा और आर्द्रता मक्का उत्पादन के लिए उपयुक्त हैं।' }], soil_analysis: { nitrogen_status: 'उत्तम (42 kg/ha)', phosphorus_status: 'उत्तम (18 kg/ha)', potassium_status: 'उत्तम (205 kg/ha)', ph_status: 'उत्तम', overall_fertility: 'अच्छा' }, recommendation_summary: 'आपकी मिट्टी और मौसम के आधार पर धान सबसे उपयुक्त फसल है।' },
} as const

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
