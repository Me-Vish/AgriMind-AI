import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Sprout, ScanSearch,
  MessageSquare, TrendingUp, Leaf, UserRound
} from 'lucide-react'
import { t, type Language } from '../../i18n'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'dashboard', icon: LayoutDashboard },
  { path: '/crop-prediction', label: 'cropPrediction', icon: Sprout },
  { path: '/disease-detection', label: 'diseaseDetection', icon: ScanSearch },
  { path: '/chat', label: 'chatAssistant', icon: MessageSquare },
  { path: '/market', label: 'marketInsights', icon: TrendingUp },
  { path: '/profile', label: 'profile', icon: UserRound },
] as const

export default function Sidebar({ language }: { language: Language }) {
  const location = useLocation()
  const dict = t(language)
  const profileLabel = language === 'ta' ? 'சுயவிவரம்' : language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0,
      width: 'var(--sidebar-width)',
      background: 'var(--color-primary)',
      display: 'flex', flexDirection: 'column',
      zIndex: 100,
    }}>
      <div style={{
        height: 'var(--topbar-height)',
        display: 'flex', alignItems: 'center', gap: '0.625rem',
        padding: '0 1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }}>
        <div style={{
          width: 30, height: 30,
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Leaf size={16} color="white" />
        </div>
        <div>
          <div style={{
            fontSize: '0.9375rem', fontWeight: 700, color: 'white',
            letterSpacing: '-0.02em', lineHeight: 1.1,
          }}>AgriMind</div>
          <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em' }}>
            {dict.aiPlatform}
          </div>
        </div>
      </div>

      <div style={{ padding: '1.25rem 1.25rem 0.5rem', fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {dict.navigation}
      </div>

      <nav style={{ flex: 1, padding: '0 0.625rem', overflowY: 'auto' }}>
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path
          return (
            <NavLink
              key={path}
              to={path}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                padding: '0.5625rem 0.75rem',
                borderRadius: 6,
                marginBottom: 2,
                fontSize: '0.875rem',
                fontWeight: active ? 600 : 400,
                color: active ? 'white' : 'rgba(255,255,255,0.65)',
                background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                transition: 'all 150ms ease',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
              }}
            >
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              <span>{label === 'profile' ? profileLabel : dict[label]}</span>
              {active && (
                <div style={{
                  marginLeft: 'auto', width: 5, height: 5,
                  borderRadius: '50%', background: 'rgba(255,255,255,0.7)',
                }} />
              )}
            </NavLink>
          )
        })}
      </nav>

      <div style={{
        padding: '1rem 1.25rem',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: '0.6875rem',
        color: 'rgba(255,255,255,0.35)',
      }}>
        <div style={{ fontWeight: 500, marginBottom: 2 }}>AgriMind AI v1.0</div>
        <div>© 2026 {dict.agricultureIntelligence}</div>
      </div>
    </aside>
  )
}
