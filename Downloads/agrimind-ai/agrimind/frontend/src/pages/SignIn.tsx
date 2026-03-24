import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function SignIn() {
  const navigate = useNavigate()
  const { signInWithGoogleMock } = useAuth()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
      background: `
        radial-gradient(circle at 18% 18%, rgba(255, 214, 102, 0.18), transparent 22%),
        radial-gradient(circle at 82% 16%, rgba(104, 176, 117, 0.16), transparent 18%),
        linear-gradient(135deg, #071b14 0%, #0c2b20 38%, #154336 72%, #255848 100%)
      `,
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `
          linear-gradient(to top, rgba(4, 14, 11, 0.6), rgba(4, 14, 11, 0.08)),
          repeating-linear-gradient(
            90deg,
            transparent 0 54px,
            rgba(255,255,255,0.03) 54px 55px
          ),
          repeating-linear-gradient(
            0deg,
            transparent 0 54px,
            rgba(255,255,255,0.025) 54px 55px
          )
        `,
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        left: '8%',
        top: '16%',
        width: '24rem',
        height: '24rem',
        borderRadius: 36,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
        transform: 'rotate(12deg)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        right: '10%',
        bottom: '14%',
        width: '28rem',
        height: '18rem',
        borderRadius: 40,
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        transform: 'rotate(-14deg)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        right: '7%',
        top: '14%',
        width: '14rem',
        height: '14rem',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 214, 102, 0.12) 0%, rgba(255, 214, 102, 0.02) 42%, rgba(255, 214, 102, 0) 70%)',
        pointerEvents: 'none',
      }} />

      <div className="card" style={{
        width: '100%',
        maxWidth: 500,
        borderRadius: 32,
        boxShadow: '0 30px 80px rgba(7, 18, 10, 0.38)',
        background: 'rgba(255,255,255,0.94)',
        border: '1px solid rgba(255,255,255,0.45)',
        backdropFilter: 'blur(16px)',
        position: 'relative',
        zIndex: 1,
        animation: 'cardFloat 0.9s ease-out',
      }}>
        <div className="card-body" style={{ padding: '2.5rem' }}>
          <div style={{ marginBottom: '2.2rem', textAlign: 'center', animation: 'fadeLift 0.8s ease-out' }}>
            <div style={{
              width: 72,
              height: 72,
              margin: '0 auto 1rem',
              borderRadius: 24,
              background: 'linear-gradient(145deg, #1f5f2f, #2f7d32)',
              boxShadow: '0 12px 28px rgba(33, 92, 45, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 700,
              animation: 'badgePulse 2.8s ease-in-out infinite',
            }}>
              A
            </div>
            <h1 style={{
              margin: 0,
              fontSize: '2rem',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              color: '#172217',
            }}>
              AgriMind
            </h1>
            <p style={{
              margin: '0.65rem 0 0',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: '#647067',
            }}>
              Smart agriculture workspace for planning, diagnosis, insights, and farm operations.
            </p>
          </div>

          <div
            style={{
              marginTop: '0.85rem',
              padding: '10px',
              borderRadius: 26,
              background: 'linear-gradient(135deg, rgba(63, 130, 70, 0.18) 0%, rgba(121, 191, 88, 0.08) 45%, rgba(63, 130, 70, 0.18) 100%)',
              boxShadow: '0 18px 36px rgba(30, 70, 34, 0.12)',
              animation: 'outerGlow 2.8s ease-in-out infinite',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              style={{
                width: '100%',
                height: 58,
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: 18,
                border: '1px solid #d8e0d7',
                background: 'linear-gradient(180deg, #ffffff 0%, #f7faf7 100%)',
                boxShadow: '0 10px 24px rgba(16, 24, 18, 0.08)',
                transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
                animation: 'fadeLift 1s ease-out',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 16px 30px rgba(16, 24, 18, 0.14)'
                e.currentTarget.style.borderColor = '#bfd0be'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(16, 24, 18, 0.08)'
                e.currentTarget.style.borderColor = '#d8e0d7'
              }}
              onClick={() => {
                signInWithGoogleMock()
                navigate('/profile')
              }}
            >
              <span style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4285F4',
                fontWeight: 800,
                fontSize: '1.1rem',
                background: '#eef4ff',
              }}>G</span>
              <span>Continue with Google</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeLift {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardFloat {
          0% {
            opacity: 0;
            transform: translateY(28px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes badgePulse {
          0%, 100% {
            box-shadow: 0 12px 28px rgba(33, 92, 45, 0.25);
            transform: translateY(0);
          }
          50% {
            box-shadow: 0 18px 34px rgba(33, 92, 45, 0.34);
            transform: translateY(-2px);
          }
        }

        @keyframes outerGlow {
          0%, 100% {
            box-shadow: 0 18px 36px rgba(30, 70, 34, 0.12);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 22px 46px rgba(46, 108, 52, 0.2);
            transform: scale(1.01);
          }
        }
      `}</style>
    </div>
  )
}
