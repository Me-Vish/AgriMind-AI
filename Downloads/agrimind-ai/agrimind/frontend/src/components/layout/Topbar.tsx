import { Sun, Moon, Bell, Globe } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { t, type Language } from '../../i18n'
import { useAuth } from '../../auth/AuthContext'

const PAGE_TITLES = {
  '/dashboard': { title: 'dashboard', subtitle: 'dashboardSubtitle' },
  '/crop-prediction': { title: 'cropPrediction', subtitle: 'cropSubtitle' },
  '/disease-detection': { title: 'diseaseDetection', subtitle: 'diseaseSubtitle' },
  '/chat': { title: 'chatAssistant', subtitle: 'chatSubtitle' },
  '/market': { title: 'marketInsights', subtitle: 'marketSubtitle' },
  '/profile': { title: 'profile', subtitle: 'profileSubtitle' },
} as const

const LANGUAGES = [
  { code: 'en', label: 'langEnglish' },
  { code: 'ta', label: 'langTamil' },
  { code: 'hi', label: 'langHindi' },
] as const

interface TopbarProps {
  language: Language
  onLanguageChange: (lang: Language) => void
}

export default function Topbar({ language, onLanguageChange }: TopbarProps) {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const dict = t(language)
  const info = PAGE_TITLES[location.pathname as keyof typeof PAGE_TITLES]
  const [langOpen, setLangOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifications = [dict.rainAlert, dict.nitrogenAlert]
  const notificationTitle = language === 'ta' ? 'அறிவிப்புகள்' : language === 'hi' ? 'सूचनाएँ' : 'Notifications'
  const profileTitle = language === 'ta' ? 'சுயவிவரம்' : language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'
  const profileSubtitle = language === 'ta' ? 'உங்கள் கணக்கு மற்றும் பண்ணை தகவல்களை புதுப்பிக்கவும்' : language === 'hi' ? 'अपनी प्रोफ़ाइल और फ़ार्म विवरण अपडेट करें' : 'Update your account and farm details'

  return (
    <header style={{
      height: 'var(--topbar-height)',
      background: 'var(--color-white)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex', alignItems: 'center',
      padding: '0 var(--space-8)',
      gap: 'var(--space-4)',
      flexShrink: 0,
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ flex: 1 }}>
        <h1 style={{
          fontSize: 'var(--text-base)', fontWeight: 600,
          color: 'var(--color-gray-900)', lineHeight: 1.2,
          letterSpacing: '-0.01em',
        }}>{info ? (info.title === 'profile' ? profileTitle : dict[info.title]) : 'AgriMind AI'}</h1>
        {info?.subtitle && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-gray-500)', lineHeight: 1 }}>
            {info.subtitle === 'profileSubtitle' ? profileSubtitle : dict[info.subtitle]}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        <div style={{ position: 'relative' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setLangOpen(o => !o)} style={{ gap: '0.375rem' }}>
            <Globe size={14} />
            <span style={{ fontWeight: 500 }}>
              {dict[LANGUAGES.find(l => l.code === language)?.label ?? 'langEnglish']}
            </span>
          </button>
          {langOpen && (
            <div style={{
              position: 'absolute', right: 0, top: '100%', marginTop: 4,
              background: 'var(--color-white)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden', zIndex: 200, minWidth: 120,
            }}>
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => { onLanguageChange(l.code); setLangOpen(false) }}
                  style={{
                    display: 'block', width: '100%',
                    padding: '0.5rem 0.875rem',
                    background: l.code === language ? 'var(--color-primary-pale)' : 'transparent',
                    color: l.code === language ? 'var(--color-primary)' : 'var(--color-gray-700)',
                    fontWeight: l.code === language ? 600 : 400,
                    fontSize: 'var(--text-sm)',
                    textAlign: 'left', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {dict[l.label]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button className="btn btn-ghost btn-sm" style={{ position: 'relative' }} onClick={() => setNotifOpen(v => !v)}>
            <Bell size={16} />
            <span style={{
              position: 'absolute', top: 5, right: 5,
              width: 6, height: 6, background: 'var(--color-warning)',
              borderRadius: '50%',
            }} />
          </button>
          {notifOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: 4,
              width: 320,
              background: 'var(--color-white)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden',
              zIndex: 200,
            }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--color-gray-900)' }}>
                {notificationTitle}
              </div>
              {notifications.map((message, index) => (
                <div key={index} style={{ padding: '0.75rem 1rem', borderBottom: index < notifications.length - 1 ? '1px solid var(--border-color)' : 'none', fontSize: 'var(--text-sm)', color: 'var(--color-gray-700)', lineHeight: 1.5 }}>
                  {message}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn btn-ghost btn-sm" onClick={toggleTheme} title={dict.toggleTheme}>
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <div onClick={() => navigate('/profile')} style={{
          width: 30, height: 30, borderRadius: '50%',
          background: 'var(--color-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 'var(--text-xs)', fontWeight: 600, color: 'white',
          marginLeft: '0.25rem', cursor: 'pointer', flexShrink: 0,
          overflow: 'hidden',
        }}>
          {user?.avatarUrl
            ? <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (user?.avatar ?? 'FA')}
        </div>
      </div>
    </header>
  )
}
