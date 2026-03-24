import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { getDashboardSummary, getMarketTrends } from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Thermometer, Droplets, Cloud, Info, TrendingUp, TrendingDown, Minus, Sprout, Activity } from 'lucide-react'
import { t, translateDashboardWord, translateCropName, type Language } from '../i18n'

interface DashboardData {
  soil_health: any
  weather: any
  crop_recommendations: any[]
  market_snapshot: any[]
  alerts: any[]
}

const CHART_COLORS = ['#1B5E20', '#2E7D32', '#43A047', '#66BB6A', '#A5D6A7']

export default function Dashboard() {
  const { language } = useOutletContext<{ language: Language }>()
  const dict = t(language)
  const [data, setData] = useState<DashboardData | null>(null)
  const [trends, setTrends] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getDashboardSummary(), getMarketTrends()])
      .then(([summary, trendData]) => { setData(summary); setTrends(trendData) })
      .catch(() => setError(dict.backendError))
  }, [dict.backendError])

  const demo: DashboardData = {
    soil_health: { ph: 6.8, nitrogen: 42, phosphorus: 18, potassium: 205, moisture: 64, status: 'Good' },
    weather: {
      location: 'Coimbatore, TN',
      temperature: 29,
      humidity: 71,
      rainfall_mm: 12,
      condition: 'Partly Cloudy',
      forecast: [
        { day: 'Mon', high: 31, low: 22, condition: 'Sunny' },
        { day: 'Tue', high: 29, low: 21, condition: 'Cloudy' },
        { day: 'Wed', high: 27, low: 20, condition: 'Rain' },
        { day: 'Thu', high: 30, low: 22, condition: 'Sunny' },
        { day: 'Fri', high: 32, low: 23, condition: 'Sunny' },
      ]
    },
    crop_recommendations: [
      { crop: 'Rice', suitability: 92, season: 'Kharif' },
      { crop: 'Cotton', suitability: 87, season: 'Kharif' },
      { crop: 'Maize', suitability: 81, season: 'Kharif' },
    ],
    market_snapshot: [
      { crop: 'Rice', price: 2150, change: 2.3, unit: '₹/quintal' },
      { crop: 'Wheat', price: 2275, change: -0.8, unit: '₹/quintal' },
      { crop: 'Cotton', price: 6820, change: 1.1, unit: '₹/quintal' },
      { crop: 'Maize', price: 1890, change: 0.5, unit: '₹/quintal' },
      { crop: 'Soybean', price: 4150, change: -1.4, unit: '₹/quintal' },
    ],
    alerts: []
  }

  const demoTrends = {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    crops: {
      Rice: [1980, 2020, 2060, 2100, 2120, 2150],
      Wheat: [2300, 2280, 2260, 2290, 2285, 2275],
      Cotton: [6400, 6500, 6600, 6750, 6800, 6820],
    }
  }

  const d = data || demo
  const trendSource = trends || demoTrends
  const chartData = trendSource.months.map((month: string, i: number) => {
    const entry: any = { month }
    Object.entries(trendSource.crops).forEach(([crop, prices]: [string, any]) => { entry[crop] = prices[i] })
    return entry
  })

  const soilNutrients = [
    { label: 'Nitrogen (N)', value: d.soil_health.nitrogen, max: 200, unit: 'kg/ha', color: '#1B5E20' },
    { label: 'Phosphorus (P)', value: d.soil_health.phosphorus, max: 100, unit: 'kg/ha', color: '#2E7D32' },
    { label: 'Potassium (K)', value: d.soil_health.potassium, max: 300, unit: 'kg/ha', color: '#43A047' },
    { label: 'Moisture', value: d.soil_health.moisture, max: 100, unit: '%', color: '#66BB6A' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 'var(--content-max-width)' }}>
      {error && <div className="alert alert-info"><Info size={16} /><span>{error}</span></div>}

      <div className="grid-4">
        <div className="stat-card"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}><div><p className="stat-label">{dict.temperature}</p><p className="stat-value">{d.weather.temperature}°C</p><p className="stat-meta">{translateDashboardWord(language, d.weather.condition)}</p></div><div style={{ padding: '0.375rem', background: 'var(--color-primary-pale)', borderRadius: 6 }}><Thermometer size={20} color="var(--color-primary)" /></div></div></div>
        <div className="stat-card"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}><div><p className="stat-label">{dict.humidity}</p><p className="stat-value">{d.weather.humidity}%</p><p className="stat-meta">{dict.relativeHumidity}</p></div><div style={{ padding: '0.375rem', background: 'var(--color-info-bg)', borderRadius: 6 }}><Droplets size={20} color="var(--color-info)" /></div></div></div>
        <div className="stat-card"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}><div><p className="stat-label">{dict.rainfall}</p><p className="stat-value">{d.weather.rainfall_mm} mm</p><p className="stat-meta">{dict.last24Hours}</p></div><div style={{ padding: '0.375rem', background: 'var(--color-info-bg)', borderRadius: 6 }}><Cloud size={20} color="var(--color-info)" /></div></div></div>
        <div className="stat-card"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}><div><p className="stat-label">{dict.soilHealth}</p><p className="stat-value">{translateDashboardWord(language, d.soil_health.status)}</p><p className="stat-meta">pH {d.soil_health.ph}</p></div><div style={{ padding: '0.375rem', background: 'var(--color-success-bg)', borderRadius: 6 }}><Activity size={20} color="var(--color-success)" /></div></div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-4)' }}>
        <div className="card"><div className="card-header"><span className="card-title">{dict.soilNutrientProfile}</span><span className="badge badge-success">{translateDashboardWord(language, d.soil_health.status)}</span></div><div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>{soilNutrients.map(n => <div key={n.label}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}><span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)', fontWeight: 500 }}>{n.label}</span><span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', color: 'var(--color-gray-600)' }}>{n.value} {n.unit}</span></div><div className="progress-bar"><div className="progress-fill" style={{ width: `${(n.value / n.max) * 100}%`, background: n.color }} /></div></div>)}</div></div>
        <div className="card"><div className="card-header"><span className="card-title">{dict.topCropRecommendations}</span><Sprout size={16} color="var(--color-primary)" /></div><div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>{d.crop_recommendations.map((rec: any, i: number) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: i === 0 ? 'var(--color-primary-ghost)' : 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', border: `1px solid ${i === 0 ? 'var(--color-primary-pale)' : 'var(--border-color)'}` }}><div style={{ width: 28, height: 28, background: i === 0 ? 'var(--color-primary)' : 'var(--color-gray-200)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xs)', fontWeight: 700, color: i === 0 ? 'white' : 'var(--color-gray-600)', flexShrink: 0 }}>{i + 1}</div><div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-gray-900)' }}>{translateCropName(language, rec.crop)}</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{rec.season}</div></div><div style={{ textAlign: 'right' }}><div style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--color-primary)' }}>{rec.suitability}%</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)' }}>{dict.match}</div></div></div>)}</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-4)' }}>
        <div className="card"><div className="card-header"><span className="card-title">{dict.commodityPriceTrends}</span><span className="badge badge-neutral">{dict.sixMonths}</span></div><div className="card-body"><ResponsiveContainer width="100%" height={220}><LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200)" /><XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-gray-500)' }} /><YAxis tick={{ fontSize: 11, fill: 'var(--color-gray-500)' }} width={50} /><Tooltip contentStyle={{ background: 'var(--color-white)', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 12, boxShadow: 'var(--shadow-sm)' }} formatter={(v: any) => [`₹${v}`, '']} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />{Object.keys(trendSource.crops).map((crop, i) => <Line key={crop} type="monotone" dataKey={crop} stroke={CHART_COLORS[i]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />)}</LineChart></ResponsiveContainer></div></div>
        <div className="card"><div className="card-header"><span className="card-title">{dict.marketPrices}</span><span className="badge badge-info">{dict.live}</span></div><div className="table-wrapper"><table><thead><tr><th>{dict.commodity}</th><th>{dict.price}</th><th>{dict.change}</th></tr></thead><tbody>{d.market_snapshot.map((item: any, i: number) => <tr key={i}><td style={{ fontWeight: 500 }}>{translateCropName(language, item.crop)}</td><td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)' }}>₹{item.price.toLocaleString()}</td><td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 'var(--text-xs)', fontWeight: 500, color: item.change > 0 ? 'var(--color-success)' : item.change < 0 ? 'var(--color-error)' : 'var(--color-gray-500)' }}>{item.change > 0 ? <TrendingUp size={12} /> : item.change < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}{item.change > 0 ? '+' : ''}{item.change}%</span></td></tr>)}</tbody></table></div></div>
      </div>

      <div className="card"><div className="card-header"><span className="card-title">{dict.weatherForecast} - {d.weather.location}</span></div><div className="card-body"><div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-3)' }}>{(d.weather.forecast || []).map((f: any, i: number) => <div key={i} style={{ textAlign: 'center', padding: 'var(--space-3)', background: i === 0 ? 'var(--color-primary-ghost)' : 'var(--color-gray-50)', borderRadius: 'var(--radius-md)', border: `1px solid ${i === 0 ? 'var(--color-primary-pale)' : 'var(--border-color)'}` }}><div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{translateDashboardWord(language, f.day)}</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-600)', marginBottom: 8 }}>{translateDashboardWord(language, f.condition)}</div><div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--color-gray-900)' }}>{f.high}°</div><div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>{f.low}°</div></div>)}</div></div></div>
    </div>
  )
}
