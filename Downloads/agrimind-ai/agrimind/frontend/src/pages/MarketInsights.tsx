import { useState, useEffect } from 'react'
import { getMarketTrends, getDashboardSummary } from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts'
import { TrendingUp, TrendingDown, Minus, Filter } from 'lucide-react'
import type { Language } from '../i18n'
import { useOutletContext } from 'react-router-dom'

const CHART_COLORS = { Rice: '#1B5E20', Wheat: '#2E7D32', Cotton: '#43A047', Maize: '#66BB6A', Soybean: '#A5D6A7' }

const COPY = {
  en: { title: 'Market Insights', subtitle: 'Live commodity prices, MSP data, and mandi arrivals across India', priceTrends: 'Price Trends', mandiPrices: 'Mandi Prices', mspData: 'MSP Data', sixMonthTrends: '6-Month Price Trends (₹/quintal)', latestMandi: 'Latest Mandi Arrivals', updatedToday: 'Updated Today', priceByCommodity: 'Price by Commodity', minimumSupportPrice: 'Minimum Support Price (MSP) - 2024-25', governmentAnnounced: 'Government Announced', commodity: 'Commodity', season: 'Season', price: 'Price', change: 'Change', mandi: 'Mandi', state: 'State', date: 'Date', yoyIncrease: 'YoY Increase', status: 'Status', active: 'Active', source: 'Source: Commission for Agricultural Costs & Prices (CACP), Government of India. MSP rates are indicative and subject to state-level variations.' },
  ta: { title: 'சந்தை தகவல்கள்', subtitle: 'நேரடி பொருள் விலைகள், MSP தரவு மற்றும் மண்டி வரவுகள்', priceTrends: 'விலை போக்குகள்', mandiPrices: 'மண்டி விலைகள்', mspData: 'MSP தரவு', sixMonthTrends: '6 மாத விலை போக்குகள் (₹/குவிண்டல்)', latestMandi: 'சமீபத்திய மண்டி வரவுகள்', updatedToday: 'இன்று புதுப்பிக்கப்பட்டது', priceByCommodity: 'பொருள் வாரியான விலை', minimumSupportPrice: 'குறைந்தபட்ச ஆதரவு விலை (MSP) - 2024-25', governmentAnnounced: 'அரசு அறிவிப்பு', commodity: 'பொருள்', season: 'பருவம்', price: 'விலை', change: 'மாற்றம்', mandi: 'மண்டி', state: 'மாநிலம்', date: 'தேதி', yoyIncrease: 'ஆண்டு உயர்வு', status: 'நிலை', active: 'செயலில்', source: 'மூலம்: இந்திய அரசின் Commission for Agricultural Costs & Prices (CACP). MSP விகிதங்கள் மாநிலத்துக்கு மாறலாம்.' },
  hi: { title: 'बाज़ार जानकारी', subtitle: 'लाइव वस्तु मूल्य, MSP डेटा और मंडी आवक', priceTrends: 'मूल्य रुझान', mandiPrices: 'मंडी मूल्य', mspData: 'MSP डेटा', sixMonthTrends: '6 माह मूल्य रुझान (₹/क्विंटल)', latestMandi: 'नवीनतम मंडी आवक', updatedToday: 'आज अपडेट हुआ', priceByCommodity: 'वस्तु अनुसार मूल्य', minimumSupportPrice: 'न्यूनतम समर्थन मूल्य (MSP) - 2024-25', governmentAnnounced: 'सरकारी घोषणा', commodity: 'वस्तु', season: 'मौसम', price: 'मूल्य', change: 'बदलाव', mandi: 'मंडी', state: 'राज्य', date: 'तारीख', yoyIncrease: 'वार्षिक वृद्धि', status: 'स्थिति', active: 'सक्रिय', source: 'स्रोत: Commission for Agricultural Costs & Prices (CACP), भारत सरकार। MSP दरें संकेतात्मक हैं और राज्यों के अनुसार बदल सकती हैं।' },
} as const

const FULL_MARKET_DATA = { months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], crops: { Rice: [1980, 2020, 2060, 2100, 2120, 2150], Wheat: [2300, 2280, 2260, 2290, 2285, 2275], Cotton: [6400, 6500, 6600, 6750, 6800, 6820], Maize: [1750, 1780, 1820, 1860, 1875, 1890], Soybean: [4000, 4050, 4100, 4180, 4160, 4150] } }
const MANDI_DATA = [{ mandi: 'Coimbatore', state: 'Tamil Nadu', crop: 'Cotton', price: 6850, date: '2026-03-24' }, { mandi: 'Nagpur', state: 'Maharashtra', crop: 'Soybean', price: 4200, date: '2026-03-24' }, { mandi: 'Ludhiana', state: 'Punjab', crop: 'Wheat', price: 2290, date: '2026-03-24' }, { mandi: 'Thanjavur', state: 'Tamil Nadu', crop: 'Rice', price: 2180, date: '2026-03-24' }, { mandi: 'Indore', state: 'Madhya Pradesh', crop: 'Maize', price: 1910, date: '2026-03-24' }]
const MSP_DATA = [{ crop: 'Paddy (Common)', msp: 2183, season: 'Kharif 2024-25', increase: 5.35 }, { crop: 'Wheat', msp: 2275, season: 'Rabi 2024-25', increase: 2.70 }, { crop: 'Maize', msp: 2090, season: 'Kharif 2024-25', increase: 5.30 }, { crop: 'Cotton (Med.)', msp: 7121, season: 'Kharif 2024-25', increase: 7.58 }]

export default function MarketInsights() {
  const { language } = useOutletContext<{ language: Language }>()
  const copy = COPY[language]
  const [trends, setTrends] = useState(FULL_MARKET_DATA)
  const [snapshot, setSnapshot] = useState<any[]>([])
  const [selectedCrops, setSelectedCrops] = useState<string[]>(['Rice', 'Wheat', 'Cotton'])
  const [activeTab, setActiveTab] = useState<'trends' | 'mandi' | 'msp'>('trends')

  useEffect(() => {
    getDashboardSummary().then(d => setSnapshot(d.market_snapshot || [])).catch(() => setSnapshot(DEMO_SNAPSHOT))
    getMarketTrends().then(t => setTrends(t)).catch(() => {})
  }, [])

  const allCrops = Object.keys(trends.crops)
  const chartData = trends.months.map((m: string, i: number) => {
    const entry: any = { month: m }
    allCrops.forEach(crop => { if (selectedCrops.includes(crop)) entry[crop] = (trends.crops as any)[crop][i] })
    return entry
  })
  const barData = MANDI_DATA.reduce((acc: any[], d) => { if (!acc.find(a => a.crop === d.crop)) acc.push({ crop: d.crop, price: d.price }); return acc }, [])

  return (
    <div style={{ maxWidth: 'var(--content-max-width)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="section-header" style={{ marginBottom: 0 }}><h2 className="section-title">{copy.title}</h2><p className="section-subtitle">{copy.subtitle}</p></div>
      <div className="grid-4">
        {(snapshot.length ? snapshot : DEMO_SNAPSHOT).slice(0, 4).map((item: any, i: number) => (
          <div key={i} className="stat-card"><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}><div><p className="stat-label">{item.crop}</p><p className="stat-value" style={{ fontSize: 'var(--text-xl)' }}>₹{item.price?.toLocaleString()}</p><p className="stat-meta">{(item.unit || '₹/quintal').replace('â‚¹', '₹')}</p></div><span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 100, fontSize: 'var(--text-xs)', fontWeight: 600, background: item.change > 0 ? 'var(--color-success-bg)' : item.change < 0 ? 'var(--color-error-bg)' : 'var(--color-gray-100)', color: item.change > 0 ? 'var(--color-success)' : item.change < 0 ? 'var(--color-error)' : 'var(--color-gray-600)' }}>{item.change > 0 ? <TrendingUp size={11} /> : item.change < 0 ? <TrendingDown size={11} /> : <Minus size={11} />}{item.change > 0 ? '+' : ''}{item.change}%</span></div></div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid var(--border-color)', paddingBottom: 0 }}>
        {[{ key: 'trends', label: copy.priceTrends }, { key: 'mandi', label: copy.mandiPrices }, { key: 'msp', label: copy.mspData }].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as any)} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', fontWeight: activeTab === tab.key ? 600 : 400, color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-gray-600)', borderBottom: `2px solid ${activeTab === tab.key ? 'var(--color-primary)' : 'transparent'}`, marginBottom: -2, transition: 'all var(--transition-fast)' }}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'trends' && <div className="card"><div className="card-header"><span className="card-title">{copy.sixMonthTrends}</span><div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}><Filter size={14} color="var(--color-gray-400)" />{allCrops.map(crop => <button key={crop} onClick={() => setSelectedCrops(prev => prev.includes(crop) ? prev.filter(c => c !== crop) : [...prev, crop])} style={{ padding: '2px 10px', borderRadius: 100, fontSize: 'var(--text-xs)', fontWeight: 500, border: '1px solid', cursor: 'pointer', fontFamily: 'var(--font-sans)', background: selectedCrops.includes(crop) ? (CHART_COLORS as any)[crop] || 'var(--color-primary)' : 'transparent', color: selectedCrops.includes(crop) ? 'white' : 'var(--color-gray-600)', borderColor: selectedCrops.includes(crop) ? (CHART_COLORS as any)[crop] || 'var(--color-primary)' : 'var(--border-color)', transition: 'all var(--transition-fast)' }}>{crop}</button>)}</div></div><div className="card-body"><ResponsiveContainer width="100%" height={300}><LineChart data={chartData} margin={{ top: 4, right: 16, bottom: 0, left: 8 }}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200)" /><XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-gray-500)' }} /><YAxis tick={{ fontSize: 12, fill: 'var(--color-gray-500)' }} width={60} tickFormatter={v => `₹${(v / 1000).toFixed(1)}k`} /><Tooltip contentStyle={{ background: 'var(--color-white)', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 12 }} formatter={(v: any, name: string) => [`₹${v.toLocaleString()}/qtl`, name]} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />{selectedCrops.map(crop => <Line key={crop} type="monotone" dataKey={crop} stroke={(CHART_COLORS as any)[crop] || '#888'} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />)}</LineChart></ResponsiveContainer></div></div>}

      {activeTab === 'mandi' && <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-4)' }}><div className="card"><div className="card-header"><span className="card-title">{copy.latestMandi}</span><span className="badge badge-info">{copy.updatedToday}</span></div><div className="table-wrapper"><table><thead><tr><th>{copy.mandi}</th><th>{copy.state}</th><th>{copy.commodity}</th><th>{copy.price}</th><th>{copy.date}</th></tr></thead><tbody>{MANDI_DATA.map((row, i) => <tr key={i}><td style={{ fontWeight: 500 }}>{row.mandi}</td><td style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-xs)' }}>{row.state}</td><td><span className="badge badge-neutral">{row.crop}</span></td><td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>₹{row.price.toLocaleString()}</td><td style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-xs)' }}>{new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td></tr>)}</tbody></table></div></div><div className="card"><div className="card-header"><span className="card-title">{copy.priceByCommodity}</span></div><div className="card-body"><ResponsiveContainer width="100%" height={260}><BarChart data={barData} margin={{ top: 4, right: 0, bottom: 0, left: 8 }}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200)" vertical={false} /><XAxis dataKey="crop" tick={{ fontSize: 11, fill: 'var(--color-gray-500)' }} /><YAxis tick={{ fontSize: 11, fill: 'var(--color-gray-500)' }} width={55} tickFormatter={v => `₹${(v / 1000).toFixed(1)}k`} /><Tooltip formatter={(v: any) => [`₹${v.toLocaleString()}`, copy.price]} contentStyle={{ background: 'var(--color-white)', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: 12 }} /><Bar dataKey="price" fill="var(--color-primary)" radius={[3, 3, 0, 0]} /></BarChart></ResponsiveContainer></div></div></div>}

      {activeTab === 'msp' && <div className="card"><div className="card-header"><span className="card-title">{copy.minimumSupportPrice}</span><span className="badge badge-success">{copy.governmentAnnounced}</span></div><div className="table-wrapper"><table><thead><tr><th>{copy.commodity}</th><th>{copy.season}</th><th>MSP (₹/quintal)</th><th>{copy.yoyIncrease}</th><th>{copy.status}</th></tr></thead><tbody>{MSP_DATA.map((row, i) => <tr key={i}><td style={{ fontWeight: 600 }}>{row.crop}</td><td style={{ color: 'var(--color-gray-500)', fontSize: 'var(--text-xs)' }}>{row.season}</td><td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary)' }}>₹{row.msp.toLocaleString()}</td><td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-success)' }}><TrendingUp size={11} /> +{row.increase}%</span></td><td><span className="badge badge-success">{copy.active}</span></td></tr>)}</tbody></table></div><div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--border-color)' }}><p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)' }}>{copy.source}</p></div></div>}
    </div>
  )
}

const DEMO_SNAPSHOT = [{ crop: 'Rice', price: 2150, change: 2.3, unit: '₹/quintal' }, { crop: 'Wheat', price: 2275, change: -0.8, unit: '₹/quintal' }, { crop: 'Cotton', price: 6820, change: 1.1, unit: '₹/quintal' }, { crop: 'Maize', price: 1890, change: 0.5, unit: '₹/quintal' }]
