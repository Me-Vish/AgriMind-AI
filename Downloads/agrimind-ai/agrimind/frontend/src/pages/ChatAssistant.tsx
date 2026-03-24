import { useState, useRef, useEffect } from 'react'
import { sendChatMessage, ChatMessage } from '../services/api'
import { useOutletContext } from 'react-router-dom'
import { Send, Mic, MicOff, User, Bot, RefreshCw, Download } from 'lucide-react'
import type { Language } from '../i18n'

const CHAT_COPY = {
  en: {
    title: 'Chat Assistant',
    subtitle: 'Ask any farming question in English, Tamil, or Hindi',
    newConversation: 'New conversation',
    assistantName: 'AgriMind AI Assistant',
    assistantIntro: 'Ask me about crops, diseases, soil health, market prices, or any farming topic.',
    placeholder: 'Type your question here... (Enter to send, Shift+Enter for new line)',
    startRecording: 'Start voice input',
    stopRecording: 'Stop recording',
    sendMessage: 'Send message',
    microphoneDenied: 'Microphone access denied.',
    voiceRecorded: '[Voice input recorded - connect backend to transcribe]',
    starters: [
      'What crops grow best in red soil?',
      'How do I improve soil nitrogen levels?',
      'When should I apply pesticides for rice?',
      'What is the MSP for wheat this year?',
    ],
    demoResponses: [
      'For rice cultivation, maintain soil pH between 5.5 and 7.0. Apply urea in split doses at transplanting, tillering, and panicle initiation.',
      'For black cotton soil, cotton and soybean are usually strong choices. Avoid deep tillage while the soil is wet and sow with the Kharif rains.',
      'To manage stem borer in rice, monitor early and use recommended control measures only after threshold levels are reached.',
      'Current MSP figures vary by crop and season. Check the latest government announcement for exact values before planning sales.',
    ],
  },
  ta: {
    title: 'அரட்டை உதவியாளர்',
    subtitle: 'ஆங்கிலம், தமிழ், அல்லது இந்தியில் விவசாய கேள்விகளை கேளுங்கள்',
    newConversation: 'புதிய உரையாடல்',
    assistantName: 'AgriMind ஏஐ உதவியாளர்',
    assistantIntro: 'பயிர்கள், நோய்கள், மண் ஆரோக்கியம், சந்தை விலைகள் அல்லது ஏதேனும் விவசாய விஷயங்கள் பற்றி என்னிடம் கேளுங்கள்.',
    placeholder: 'உங்கள் கேள்வியை இங்கே எழுதுங்கள்... (அனுப்ப Enter, புதிய வரிக்கு Shift+Enter)',
    startRecording: 'குரல் உள்ளீட்டை தொடங்கு',
    stopRecording: 'குரல் பதிவு நிறுத்து',
    sendMessage: 'செய்தி அனுப்பு',
    microphoneDenied: 'மைக்ரோஃபோன் அணுகல் மறுக்கப்பட்டது.',
    voiceRecorded: '[குரல் பதிவு செய்யப்பட்டது - உரையாக மாற்ற பின்தளத்தை இணைக்கவும்]',
    starters: [
      'சிவப்பு மண்ணில் எந்த பயிர்கள் சிறப்பாக வளரும்?',
      'மண்ணில் நைட்ரஜன் அளவை எப்படி உயர்த்துவது?',
      'நெல் பயிரில் பூச்சிக்கொல்லியை எப்போது பயன்படுத்த வேண்டும்?',
      'இந்த ஆண்டிற்கான கோதுமை MSP என்ன?',
    ],
    demoResponses: [
      'நெல் சாகுபடிக்கு மண்ணின் pH 5.5 முதல் 7.0 வரை இருந்தால் சிறந்தது. நாற்று நடும் போது, கிளை விடும் நிலையில், மற்றும் கதிர் உருவாகும் நிலையில் யூரியாவை பிரித்து இடலாம்.',
      'கரிசல் மண்ணில் பருத்தி மற்றும் சோயாபீன் நல்ல தேர்வாக இருக்கும். மண் நனைந்திருக்கும் போது ஆழ உழவு தவிர்க்கவும்.',
      'நெல் தண்டு துளைப்பான் கட்டுப்பாட்டிற்கு ஆரம்ப நிலையிலேயே கண்காணித்து, பொருளாதார சேத அளவைத் தாண்டினால் மட்டுமே பரிந்துரைக்கப்பட்ட மருந்துகளைப் பயன்படுத்தவும்.',
      'MSP மதிப்புகள் பயிர் மற்றும் பருவத்துக்கு மாறும். விற்பனைக்கு முன் அரசின் சமீபத்திய அறிவிப்பைச் சரிபார்க்கவும்.',
    ],
  },
  hi: {
    title: 'चैट सहायक',
    subtitle: 'अंग्रेज़ी, तमिल या हिंदी में खेती से जुड़ा कोई भी सवाल पूछें',
    newConversation: 'नई बातचीत',
    assistantName: 'AgriMind एआई सहायक',
    assistantIntro: 'मुझसे फसलों, रोगों, मिट्टी के स्वास्थ्य, बाज़ार भाव या किसी भी खेती के विषय पर पूछें।',
    placeholder: 'अपना सवाल यहाँ लिखें... (भेजने के लिए Enter, नई पंक्ति के लिए Shift+Enter)',
    startRecording: 'आवाज़ इनपुट शुरू करें',
    stopRecording: 'रिकॉर्डिंग रोकें',
    sendMessage: 'संदेश भेजें',
    microphoneDenied: 'माइक्रोफोन की अनुमति नहीं मिली।',
    voiceRecorded: '[आवाज़ रिकॉर्ड हो गई - लिप्यंतरण के लिए बैकएंड जोड़ें]',
    starters: [
      'लाल मिट्टी में कौन सी फसलें सबसे अच्छी होती हैं?',
      'मिट्टी में नाइट्रोजन स्तर कैसे बढ़ाऊँ?',
      'धान में कीटनाशक कब लगाना चाहिए?',
      'इस वर्ष गेहूँ का MSP क्या है?',
    ],
    demoResponses: [
      'धान की खेती के लिए मिट्टी का pH 5.5 से 7.0 के बीच रखना अच्छा है। यूरिया को रोपाई, टिलरिंग और पैनिकल बनने के समय भागों में दें।',
      'काली कपास मिट्टी में कपास और सोयाबीन अच्छे विकल्प होते हैं। मिट्टी गीली हो तो गहरी जुताई से बचें।',
      'धान में स्टेम बोरर नियंत्रण के लिए शुरुआती निगरानी करें और आर्थिक क्षति स्तर पार होने पर ही अनुशंसित दवा का उपयोग करें।',
      'MSP फसल और मौसम के अनुसार बदलता है। बिक्री की योजना से पहले नवीनतम सरकारी घोषणा देखें।',
    ],
  },
} as const

export default function ChatAssistant() {
  const { language } = useOutletContext<{ language: Language }>()
  const copy = CHAT_COPY[language]
  const downloadChatLabel = language === 'ta' ? 'அரட்டையை பதிவிறக்கவும்' : language === 'hi' ? 'चैट डाउनलोड करें' : 'Download chat'
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([...copy.starters])
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (messages.length === 0) setSuggestions([...copy.starters])
  }, [copy, messages.length])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    const userMsg: ChatMessage = { role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setSuggestions([])
    try {
      const data = await sendChatMessage(trimmed, [...messages, userMsg], language)
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      if (data.suggested_questions?.length) setSuggestions(data.suggested_questions)
    } catch {
      const fallback = copy.demoResponses[Math.floor(Math.random() * copy.demoResponses.length)]
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const toggleRecording = async () => {
    if (recording) {
      mediaRecorderRef.current?.stop()
      setRecording(false)
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        setInput(prev => prev + copy.voiceRecorded)
      }
      recorder.start()
      mediaRecorderRef.current = recorder
      setRecording(true)
    } catch {
      alert(copy.microphoneDenied)
    }
  }

  const clearChat = () => {
    setMessages([])
    setSuggestions([...copy.starters])
  }

  const downloadChat = () => {
    if (messages.length === 0) return
    const transcript = messages
      .map(message => `${message.role === 'user' ? 'User' : copy.assistantName}: ${message.content}`)
      .join('\n\n')
    downloadTextFile(`chat-history-${language}.txt`, transcript)
  }

  return (
    <div style={{ maxWidth: 860, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', height: 'calc(100vh - var(--topbar-height) - 3rem)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
        <div>
          <h2 className="section-title">{copy.title}</h2>
          <p className="section-subtitle">{copy.subtitle}</p>
        </div>
        {messages.length > 0 && (
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="btn btn-secondary btn-sm" onClick={downloadChat}>
              <Download size={14} /> {downloadChatLabel}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={clearChat}>
              <RefreshCw size={14} /> {copy.newConversation}
            </button>
          </div>
        )}
      </div>

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {messages.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 'var(--space-4)', padding: 'var(--space-8) 0' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={24} color="var(--color-primary)" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--color-gray-900)', marginBottom: 4 }}>{copy.assistantName}</p>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-gray-500)' }}>{copy.assistantIntro}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', width: '100%', maxWidth: 480 }}>
                {copy.starters.map((q, i) => (
                  <button key={i} className="btn btn-secondary" style={{ textAlign: 'left', height: 'auto', padding: 'var(--space-3) var(--space-4)', fontWeight: 400, lineHeight: 1.4 }} onClick={() => sendMessage(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}

          {loading && (
            <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={14} color="var(--color-primary)" />
              </div>
              <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--color-gray-50)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(n => (
                  <span key={n} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-gray-400)', animation: 'bounce 1.2s ease infinite', animationDelay: `${n * 0.15}s`, display: 'inline-block' }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length > 0 && suggestions.length > 0 && !loading && (
          <div style={{ padding: 'var(--space-2) var(--space-6)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {suggestions.map((q, i) => (
              <button key={i} className="btn btn-secondary btn-sm" style={{ fontWeight: 400 }} onClick={() => sendMessage(q)}>
                {q}
              </button>
            ))}
          </div>
        )}

        <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={copy.placeholder}
            rows={2}
            style={{ flex: 1, padding: 'var(--space-3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', resize: 'none', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--color-gray-900)', background: 'var(--color-white)', lineHeight: 1.5, outline: 'none', transition: 'border-color var(--transition-fast)' }}
            onFocus={e => e.target.style.borderColor = 'var(--color-primary-light)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <button className={`btn ${recording ? 'btn-primary' : 'btn-secondary'}`} onClick={toggleRecording} title={recording ? copy.stopRecording : copy.startRecording} style={{ width: 38, padding: 0 }}>
              {recording ? <MicOff size={15} /> : <Mic size={15} />}
            </button>
            <button className="btn btn-primary" onClick={() => sendMessage(input)} disabled={!input.trim() || loading} title={copy.sendMessage} style={{ width: 38, padding: 0 }}>
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
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

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: isUser ? 'var(--color-primary)' : 'var(--color-primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {isUser ? <User size={14} color="white" /> : <Bot size={14} color="var(--color-primary)" />}
      </div>
      <div style={{ maxWidth: '72%', padding: 'var(--space-3) var(--space-4)', background: isUser ? 'var(--color-primary)' : 'var(--color-white)', color: isUser ? 'white' : 'var(--color-gray-800)', borderRadius: 'var(--radius-md)', border: isUser ? 'none' : '1px solid var(--border-color)', fontSize: 'var(--text-sm)', lineHeight: 1.65, boxShadow: 'var(--shadow-xs)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {message.content}
      </div>
    </div>
  )
}
