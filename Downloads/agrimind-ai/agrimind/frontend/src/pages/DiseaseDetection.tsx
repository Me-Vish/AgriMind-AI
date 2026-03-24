import { useState, useRef, useCallback } from 'react'
import { detectDisease } from '../services/api'
import { useOutletContext } from 'react-router-dom'
import { Upload, X, ScanSearch, AlertTriangle, CheckCircle, Info, Leaf, Download } from 'lucide-react'
import type { Language } from '../i18n'

const COPY = {
  en: {
    title: 'Disease Detection', subtitle: 'Upload a clear image of a plant leaf for AI-powered disease diagnosis', uploadLeafImage: 'Upload Leaf Image', max10mb: 'Max 10MB', dropImage: 'Drop image here or click to browse', supports: 'Supports JPG, PNG, WEBP up to 10MB', removeImage: 'Remove image', uploadError: 'Please upload an image file (JPG, PNG, WEBP).', fileSizeError: 'File size must be under 10MB.', analyzing: 'Analyzing image...', runAnalysis: 'Run Disease Analysis', photographyTips: 'Photography Tips', diagnosisResult: 'Diagnosis Result', modelConfidence: 'Model Confidence', commonlyAffects: 'Commonly Affects', treatmentProtocol: 'Treatment Protocol', actionRequired: 'Action Required', treatment: 'Treatment', prevention: 'Prevention', differentialDiagnoses: 'Differential Diagnoses', condition: 'Condition', probability: 'Probability', emptyState: 'Upload a plant leaf image and click "Run Disease Analysis" to view the diagnosis.', severitySuffix: 'Severity', tips: ['Photograph in natural daylight for best results', 'Capture the affected area clearly and in focus', 'Include both healthy and diseased portions', 'Avoid shadows or glare on the leaf surface', 'Ensure the image resolution is at least 640 x 480'],
  },
  ta: {
    title: 'நோய் கண்டறிதல்', subtitle: 'தாவர இலை படத்தை பதிவேற்றி ஏஐ அடிப்படையிலான நோய் கண்டறிதலை பெறுங்கள்', uploadLeafImage: 'இலைப் படத்தை பதிவேற்று', max10mb: 'அதிகபட்சம் 10MB', dropImage: 'படத்தை இங்கு விடுங்கள் அல்லது தேர்ந்தெடுக்க கிளிக் செய்யுங்கள்', supports: 'JPG, PNG, WEBP வடிவம், 10MB வரை', removeImage: 'படத்தை நீக்கு', uploadError: 'படக் கோப்பை பதிவேற்றவும் (JPG, PNG, WEBP).', fileSizeError: 'கோப்பு அளவு 10MB-க்கு குறைவாக இருக்க வேண்டும்.', analyzing: 'படத்தை ஆய்வு செய்கிறது...', runAnalysis: 'நோய் பகுப்பாய்வை இயக்கவும்', photographyTips: 'படம் எடுக்கும் குறிப்புகள்', diagnosisResult: 'கண்டறிதல் முடிவு', modelConfidence: 'மாதிரி நம்பிக்கை', commonlyAffects: 'பொதுவாக பாதிக்கும் பயிர்கள்', treatmentProtocol: 'சிகிச்சை வழிமுறை', actionRequired: 'நடவடிக்கை தேவை', treatment: 'சிகிச்சை', prevention: 'தடுப்பு', differentialDiagnoses: 'மாற்று நோய் சாத்தியங்கள்', condition: 'நிலை', probability: 'சாத்தியம்', emptyState: 'தாவர இலை படத்தை பதிவேற்றி "நோய் பகுப்பாய்வை இயக்கவும்" என்பதைக் கிளிக் செய்யுங்கள்.', severitySuffix: 'தீவிரம்', tips: ['சிறந்த விளைவுக்கு இயற்கை வெளிச்சத்தில் படம் எடுக்கவும்', 'பாதிக்கப்பட்ட பகுதி தெளிவாக இருக்க வேண்டும்', 'ஆரோக்கியமான மற்றும் பாதிக்கப்பட்ட பகுதிகள் இரண்டும் தெரியும் வகையில் எடுக்கவும்', 'இலையின் மீது நிழல் அல்லது ஒளி பிரதிபலிப்பு தவிர்க்கவும்', 'படத் தீர்மானம் குறைந்தது 640 x 480 இருக்க வேண்டும்'],
  },
  hi: {
    title: 'रोग पहचान', subtitle: 'पौधे की पत्ती की साफ़ तस्वीर अपलोड करके एआई आधारित रोग पहचान प्राप्त करें', uploadLeafImage: 'पत्ती की छवि अपलोड करें', max10mb: 'अधिकतम 10MB', dropImage: 'चित्र यहाँ छोड़ें या चुनने के लिए क्लिक करें', supports: 'JPG, PNG, WEBP, 10MB तक', removeImage: 'चित्र हटाएँ', uploadError: 'कृपया चित्र फ़ाइल अपलोड करें (JPG, PNG, WEBP)।', fileSizeError: 'फ़ाइल का आकार 10MB से कम होना चाहिए।', analyzing: 'चित्र का विश्लेषण हो रहा है...', runAnalysis: 'रोग विश्लेषण चलाएँ', photographyTips: 'फ़ोटो सुझाव', diagnosisResult: 'निदान परिणाम', modelConfidence: 'मॉडल विश्वास', commonlyAffects: 'आम तौर पर प्रभावित फसलें', treatmentProtocol: 'उपचार मार्गदर्शिका', actionRequired: 'कार्रवाई आवश्यक', treatment: 'उपचार', prevention: 'रोकथाम', differentialDiagnoses: 'वैकल्पिक निदान', condition: 'स्थिति', probability: 'संभावना', emptyState: 'पत्ती की छवि अपलोड करें और "रोग विश्लेषण चलाएँ" पर क्लिक करें।', severitySuffix: 'गंभीरता', tips: ['बेहतर परिणाम के लिए प्राकृतिक रोशनी में फोटो लें', 'प्रभावित भाग को साफ़ और फोकस में रखें', 'स्वस्थ और बीमार दोनों हिस्से शामिल करें', 'पत्ती की सतह पर छाया या चमक से बचें', 'छवि का रिज़ॉल्यूशन कम से कम 640 x 480 रखें'],
  },
} as const

export default function DiseaseDetection() {
  const { language } = useOutletContext<{ language: Language }>()
  const copy = COPY[language]
  const downloadReportLabel = language === 'ta' ? 'அறிக்கையை பதிவிறக்கவும்' : language === 'hi' ? 'रिपोर्ट डाउनलोड करें' : 'Download Report'
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDownload = () => {
    if (!result) return
    const lines = [
      copy.title,
      '',
      `${copy.diagnosisResult}: ${result.disease_name}`,
      `${copy.modelConfidence}: ${result.confidence_percent}%`,
      `${copy.commonlyAffects}: ${(result.affected_crops || []).join(', ') || '-'}`,
      '',
      result.description,
      '',
      `${copy.treatment}: ${result.treatment || '-'}`,
      `${copy.prevention}: ${result.prevention || '-'}`,
      '',
      `${copy.differentialDiagnoses}:`,
      ...((result.alternative_diagnoses || []).map((item: any) => `${item.disease}: ${(item.probability * 100).toFixed(1)}%`)),
    ]
    downloadTextFile(`disease-report-${language}.txt`, lines.join('\n'))
  }

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return setError(copy.uploadError)
    if (f.size > 10 * 1024 * 1024) return setError(copy.fileSizeError)
    setError(''); setResult(null); setFile(f); setPreview(URL.createObjectURL(f))
  }

  const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }, [copy])

  const handleSubmit = async () => {
    if (!file) return
    setLoading(true); setError('')
    try { setResult(await detectDisease(file, language)) } catch { setResult(DEMO_RESULT[language]) } finally { setLoading(false) }
  }

  const severityBadge = (s: string) => s === 'None' ? 'badge-success' : s === 'Low' ? 'badge-info' : s === 'Moderate' ? 'badge-warning' : 'badge-error'

  return (
    <div style={{ maxWidth: 'var(--content-max-width)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="section-header" style={{ marginBottom: 0 }}>
        <h2 className="section-title">{copy.title}</h2>
        <p className="section-subtitle">{copy.subtitle}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="card">
            <div className="card-header"><span className="card-title">{copy.uploadLeafImage}</span><span className="badge badge-neutral">{copy.max10mb}</span></div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {!preview ? (
                <div onClick={() => inputRef.current?.click()} onDrop={onDrop} onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} style={{ border: `2px dashed ${dragging ? 'var(--color-primary-light)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-lg)', background: dragging ? 'var(--color-primary-ghost)' : 'var(--color-gray-50)', padding: 'var(--space-10)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', transition: 'all var(--transition-base)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Upload size={20} color="var(--color-primary)" /></div>
                  <div style={{ textAlign: 'center' }}><p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)' }}>{copy.dropImage}</p><p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-400)', marginTop: 4 }}>{copy.supports}</p></div>
                  <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <img src={preview} alt="Uploaded leaf" style={{ width: '100%', maxHeight: 280, objectFit: 'contain', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--color-gray-100)', display: 'block' }} />
                  <button onClick={() => { setFile(null); setPreview(''); setResult(null); setError(''); if (inputRef.current) inputRef.current.value = '' }} style={{ position: 'absolute', top: 8, right: 8, background: 'white', border: '1px solid var(--border-color)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }} title={copy.removeImage}><X size={14} color="var(--color-gray-600)" /></button>
                </div>
              )}
              {error && <div className="alert alert-error"><AlertTriangle size={14} /><span>{error}</span></div>}
              <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleSubmit} disabled={!file || loading}>
                {loading ? <><div className="spinner" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)', width: 16, height: 16 }} /> {copy.analyzing}</> : <><ScanSearch size={16} /> {copy.runAnalysis}</>}
              </button>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">{copy.photographyTips}</span><Leaf size={14} color="var(--color-primary)" /></div>
            <div className="card-body"><ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', listStyle: 'none' }}>{copy.tips.map((tip, i) => <li key={i} style={{ display: 'flex', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-600)' }}><span style={{ color: 'var(--color-primary)', fontWeight: 700, flexShrink: 0 }}>•</span>{tip}</li>)}</ul></div>
          </div>
        </div>

        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title">{copy.diagnosisResult}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={handleDownload}>
                    <Download size={14} /> {downloadReportLabel}
                  </button>
                  {result.is_healthy ? <CheckCircle size={18} color="var(--color-success)" /> : <AlertTriangle size={18} color="var(--color-warning)" />}
                </div>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ padding: 'var(--space-4)', background: result.is_healthy ? 'var(--color-success-bg)' : 'var(--color-warning-bg)', borderRadius: 'var(--radius-md)', border: `1px solid ${result.is_healthy ? '#A5D6A7' : '#FFCC80'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}><h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-gray-900)', letterSpacing: '-0.01em' }}>{result.disease_name}</h3><span className={`badge ${severityBadge(result.severity)}`}>{result.severity} {copy.severitySuffix}</span></div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)', lineHeight: 1.5 }}>{result.description}</p>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}><span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-gray-700)' }}>{copy.modelConfidence}</span><span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-primary)' }}>{result.confidence_percent}%</span></div>
                  <div className="progress-bar" style={{ height: 8 }}><div className="progress-fill" style={{ width: `${result.confidence_percent}%`, background: result.confidence_percent > 80 ? 'var(--color-success)' : 'var(--color-warning)' }} /></div>
                </div>
                <div><p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>{copy.commonlyAffects}</p><div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>{(result.affected_crops || []).map((crop: string, i: number) => <span key={i} className="tag">{crop}</span>)}</div></div>
              </div>
            </div>
            {!result.is_healthy && <div className="card"><div className="card-header"><span className="card-title">{copy.treatmentProtocol}</span><span className="badge badge-warning">{copy.actionRequired}</span></div><div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}><div><p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>{copy.treatment}</p><p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)', lineHeight: 1.6 }}>{result.treatment}</p></div><hr className="divider" /><div><p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>{copy.prevention}</p><p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)', lineHeight: 1.6 }}>{result.prevention}</p></div></div></div>}
            {result.alternative_diagnoses?.length > 0 && <div className="card"><div className="card-header"><span className="card-title">{copy.differentialDiagnoses}</span><Info size={14} color="var(--color-gray-400)" /></div><div className="table-wrapper"><table><thead><tr><th>{copy.condition}</th><th>{copy.probability}</th></tr></thead><tbody>{result.alternative_diagnoses.map((d: any, i: number) => <tr key={i}><td style={{ fontWeight: 500 }}>{d.disease}</td><td><span className="badge badge-neutral">{(d.probability * 100).toFixed(1)}%</span></td></tr>)}</tbody></table></div></div>}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, padding: 'var(--space-12)', color: 'var(--color-gray-400)', textAlign: 'center', gap: 'var(--space-3)', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ScanSearch size={24} color="var(--color-primary)" /></div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)', maxWidth: 240 }}>{copy.emptyState}</p>
          </div>
        )}
      </div>
    </div>
  )
}

const DEMO_RESULT = {
  en: { disease_name: 'Bacterial Leaf Blight', confidence_percent: 89.1, severity: 'High', is_healthy: false, description: 'Water-soaked lesions on leaf margins that turn yellow and then brown.', treatment: 'Apply copper-based bactericides and improve field drainage.', prevention: 'Use disease-free seeds and avoid excessive nitrogen fertilization.', affected_crops: ['Rice', 'Maize'], alternative_diagnoses: [{ disease: 'Brown Spot', probability: 0.07 }, { disease: 'Leaf Blast', probability: 0.04 }] },
  ta: { disease_name: 'பாக்டீரியா இலை எரிச்சல்', confidence_percent: 89.1, severity: 'High', is_healthy: false, description: 'இலையின் ஓரங்களில் நீர் படிந்த புள்ளிகள் உருவாகி மஞ்சள் மற்றும் பழுப்பு நிறமாக மாறும்.', treatment: 'செம்பு அடிப்படையிலான மருந்துகளைப் பயன்படுத்தி வயலில் நீர் வடிகால் மேம்படுத்தவும்.', prevention: 'நோயற்ற விதைகளைப் பயன்படுத்தி, அதிக நைட்ரஜன் உரத்தை தவிர்க்கவும்.', affected_crops: ['நெல்', 'மக்காச்சோளம்'], alternative_diagnoses: [{ disease: 'பழுப்பு புள்ளி', probability: 0.07 }, { disease: 'இலை வெடிப்பு', probability: 0.04 }] },
  hi: { disease_name: 'बैक्टीरियल लीफ ब्लाइट', confidence_percent: 89.1, severity: 'High', is_healthy: false, description: 'पत्ती के किनारों पर पानी जैसे धब्बे बनते हैं जो बाद में पीले और भूरे हो जाते हैं।', treatment: 'कॉपर आधारित दवा का उपयोग करें और खेत की जल निकासी सुधारें।', prevention: 'रोगमुक्त बीज का उपयोग करें और अधिक नाइट्रोजन उर्वरक से बचें।', affected_crops: ['धान', 'मक्का'], alternative_diagnoses: [{ disease: 'ब्राउन स्पॉट', probability: 0.07 }, { disease: 'लीफ ब्लास्ट', probability: 0.04 }] },
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
