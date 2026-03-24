import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Droplets, CalendarClock, Gauge, ShieldAlert, ChevronRight, Download } from 'lucide-react'
import { getIrrigationPlan, type IrrigationPlannerInput } from '../services/api'
import type { Language } from '../i18n'

const COPY = {
  en: {
    title: 'Irrigation Planner',
    subtitle: 'Build a smarter watering schedule from crop, soil, and weather signals',
    fieldInputs: 'Field Inputs',
    generate: 'Generate Plan',
    reset: 'Reset',
    crop: 'Crop',
    soilType: 'Soil Type',
    growthStage: 'Growth Stage',
    farmSize: 'Farm Size (acres)',
    temperature: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    rainfall: 'Rainfall last 7 days (mm)',
    planSummary: 'Plan Summary',
    download: 'Download Plan',
    irrigationNeed: 'Irrigation Need',
    nextWindow: 'Next Irrigation',
    waterAmount: 'Water Amount',
    riskLevel: 'Risk Level',
    recommendations: 'Field Notes',
    empty: 'Enter field conditions to generate an irrigation schedule.',
  },
  ta: {
    title: 'நீர்ப்பாசன திட்டமிடுதல்',
    subtitle: 'பயிர், மண், மற்றும் வானிலை அறிகுறிகளிலிருந்து சிறந்த நீர்ப்பாசன திட்டம் அமைக்கவும்',
    fieldInputs: 'புல உள்ளீடுகள்',
    generate: 'திட்டத்தை உருவாக்கவும்',
    reset: 'மீட்டமை',
    crop: 'பயிர்',
    soilType: 'மண் வகை',
    growthStage: 'வளர்ச்சி நிலை',
    farmSize: 'பண்ணை அளவு (ஏக்கர்)',
    temperature: 'வெப்பநிலை (°C)',
    humidity: 'ஈரப்பதம் (%)',
    rainfall: 'கடந்த 7 நாள் மழை (மிமீ)',
    planSummary: 'திட்ட சுருக்கம்',
    download: 'திட்டத்தை பதிவிறக்கவும்',
    irrigationNeed: 'நீர்ப்பாசன தேவை',
    nextWindow: 'அடுத்த நீர்ப்பாசனம்',
    waterAmount: 'தண்ணீர் அளவு',
    riskLevel: 'ஆபத்து நிலை',
    recommendations: 'புல குறிப்புகள்',
    empty: 'நீர்ப்பாசன அட்டவணையை உருவாக்க புல தகவல்களை உள்ளிடவும்.',
  },
  hi: {
    title: 'सिंचाई योजनाकार',
    subtitle: 'फसल, मिट्टी और मौसम संकेतों से बेहतर सिंचाई योजना बनाएं',
    fieldInputs: 'फील्ड इनपुट',
    generate: 'योजना बनाएं',
    reset: 'रीसेट',
    crop: 'फसल',
    soilType: 'मिट्टी का प्रकार',
    growthStage: 'विकास चरण',
    farmSize: 'खेत का आकार (एकड़)',
    temperature: 'तापमान (°C)',
    humidity: 'आर्द्रता (%)',
    rainfall: 'पिछले 7 दिन की वर्षा (मिमी)',
    planSummary: 'योजना सारांश',
    download: 'योजना डाउनलोड करें',
    irrigationNeed: 'सिंचाई आवश्यकता',
    nextWindow: 'अगली सिंचाई',
    waterAmount: 'पानी की मात्रा',
    riskLevel: 'जोखिम स्तर',
    recommendations: 'फील्ड नोट्स',
    empty: 'सिंचाई शेड्यूल बनाने के लिए खेत की जानकारी दर्ज करें।',
  },
} as const

const INITIAL = {
  crop: 'Rice',
  soil_type: 'alluvial',
  growth_stage: 'vegetative',
  farm_size: '12',
  temperature: '29',
  humidity: '71',
  rainfall_7d: '12',
}

const CROPS = ['Rice', 'Wheat', 'Cotton', 'Maize', 'Sugarcane', 'Groundnut']
const SOILS = ['alluvial', 'red', 'black', 'loam', 'sandy']
const STAGES = ['sowing', 'vegetative', 'flowering', 'harvest'] as const

export default function IrrigationPlanner() {
  const { language } = useOutletContext<{ language: Language }>()
  const copy = COPY[language]
  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleDownload = () => {
    if (!result) return
    const content = [
      copy.title,
      '',
      `${copy.planSummary}:`,
      result.recommendation_summary,
      '',
      `${copy.irrigationNeed}: ${result.irrigation_need}`,
      `${copy.nextWindow}: ${result.next_irrigation}`,
      `${copy.waterAmount}: ${result.water_amount}`,
      `${copy.riskLevel}: ${result.risk_level}`,
      '',
      `${copy.recommendations}:`,
      ...result.notes.map((note: string, index: number) => `${index + 1}. ${note}`),
    ].join('\n')
    downloadTextFile(`irrigation-plan-${language}.txt`, content)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload: IrrigationPlannerInput = {
        crop: form.crop,
        soil_type: form.soil_type,
        growth_stage: form.growth_stage as IrrigationPlannerInput['growth_stage'],
        farm_size: parseFloat(form.farm_size),
        temperature: parseFloat(form.temperature),
        humidity: parseFloat(form.humidity),
        rainfall_7d: parseFloat(form.rainfall_7d),
        language,
      }
      setResult(await getIrrigationPlan(payload))
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

      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        <div className="card">
          <div className="card-header"><span className="card-title">{copy.fieldInputs}</span></div>
          <div className="card-body">
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-4)' }}>
              <SelectField label={copy.crop} value={form.crop} onChange={value => setForm(prev => ({ ...prev, crop: value }))} options={CROPS} />
              <SelectField label={copy.soilType} value={form.soil_type} onChange={value => setForm(prev => ({ ...prev, soil_type: value }))} options={SOILS} />
              <SelectField label={copy.growthStage} value={form.growth_stage} onChange={value => setForm(prev => ({ ...prev, growth_stage: value }))} options={[...STAGES]} />
              <InputField label={copy.farmSize} value={form.farm_size} onChange={value => setForm(prev => ({ ...prev, farm_size: value }))} />
              <InputField label={copy.temperature} value={form.temperature} onChange={value => setForm(prev => ({ ...prev, temperature: value }))} />
              <InputField label={copy.humidity} value={form.humidity} onChange={value => setForm(prev => ({ ...prev, humidity: value }))} />
              <InputField label={copy.rainfall} value={form.rainfall_7d} onChange={value => setForm(prev => ({ ...prev, rainfall_7d: value }))} />
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  <ChevronRight size={16} /> {loading ? '...' : copy.generate}
                </button>
                <button type="button" className="btn btn-secondary btn-lg" onClick={() => { setForm(INITIAL); setResult(null) }}>
                  {copy.reset}
                </button>
              </div>
            </form>
          </div>
        </div>

        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title">{copy.planSummary}</span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={handleDownload}>
                  <Download size={14} /> {copy.download}
                </button>
              </div>
              <div className="card-body"><p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)', lineHeight: 1.7 }}>{result.recommendation_summary}</p></div>
            </div>

            <div className="grid-2" style={{ gap: 'var(--space-4)' }}>
              <StatCard icon={<Droplets size={18} color="var(--color-primary)" />} label={copy.irrigationNeed} value={result.irrigation_need} />
              <StatCard icon={<CalendarClock size={18} color="var(--color-primary)" />} label={copy.nextWindow} value={result.next_irrigation} />
              <StatCard icon={<Gauge size={18} color="var(--color-primary)" />} label={copy.waterAmount} value={result.water_amount} />
              <StatCard icon={<ShieldAlert size={18} color="var(--color-primary)" />} label={copy.riskLevel} value={result.risk_level} />
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">{copy.recommendations}</span></div>
              <div className="card-body">
                <ul style={{ display: 'grid', gap: 'var(--space-3)', listStyle: 'none' }}>
                  {result.notes.map((note: string, index: number) => (
                    <li key={index} style={{ padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'var(--color-gray-50)', color: 'var(--color-gray-700)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-8)', background: 'var(--color-white)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', color: 'var(--color-gray-500)' }}>
            {copy.empty}
          </div>
        )}
      </div>
    </div>
  )
}

function InputField({ label, value, onChange }: { label: string, value: string, onChange: (value: string) => void }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input className="form-input" type="number" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

function SelectField({ label, value, onChange, options }: { label: string, value: string, onChange: (value: string) => void, options: string[] }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select className="form-input" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="card">
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: 'var(--color-primary-pale)' }}>
          {icon}
        </div>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <strong style={{ fontSize: 'var(--text-base)', color: 'var(--color-gray-900)', lineHeight: 1.4 }}>{value}</strong>
      </div>
    </div>
  )
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
