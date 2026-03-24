import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function SignIn() {
  const navigate = useNavigate()
  const { signInWithGoogleMock } = useAuth()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        background: `
          radial-gradient(circle at 78% 18%, rgba(255, 225, 128, 0.85) 0%, rgba(255, 225, 128, 0.32) 16%, rgba(255, 225, 128, 0) 34%),
          linear-gradient(180deg, #dcecf0 0%, #efe0ab 26%, #7da54c 58%, #345b23 82%, #19331a 100%)
        `,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(to top, rgba(14, 30, 13, 0.45), rgba(14, 30, 13, 0.04)),
            repeating-linear-gradient(
              -12deg,
              rgba(98, 148, 51, 0.22) 0 22px,
              rgba(79, 129, 42, 0.22) 22px 44px,
              rgba(58, 104, 34, 0.16) 44px 66px
            )
          `,
          clipPath: 'polygon(0 56%, 100% 34%, 100% 100%, 0 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0))',
          pointerEvents: 'none',
        }}
      />

      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 760,
          borderRadius: 32,
          padding: '3.25rem 2.5rem',
          textAlign: 'center',
          background: 'rgba(14, 27, 15, 0.34)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 28px 70px rgba(10, 22, 10, 0.28)',
          position: 'relative',
          zIndex: 1,
          animation: 'cardEnter 0.8s ease-out',
        }}
      >
        <div
          style={{
            width: 82,
            height: 82,
            margin: '0 auto 1.2rem',
            borderRadius: 28,
            background: 'linear-gradient(145deg, #1d5f2b, #2e7d32)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: 700,
            boxShadow: '0 16px 34px rgba(24, 72, 33, 0.28)',
            animation: 'badgeFloat 3s ease-in-out infinite',
          }}
        >
          A
        </div>

        <p
          style={{
            margin: 0,
            color: 'rgba(242, 247, 238, 0.84)',
            fontSize: '0.9rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Sustainable Agri Platform
        </p>

        <h1
          style={{
            margin: '0.9rem auto 0',
            maxWidth: 560,
            fontSize: '3.3rem',
            lineHeight: 1.04,
            letterSpacing: '-0.06em',
            color: '#ffffff',
            textShadow: '0 10px 28px rgba(0,0,0,0.18)',
          }}
        >
          Grow with smart farming decisions
        </h1>

        <p
          style={{
            margin: '1rem auto 0',
            maxWidth: 560,
            fontSize: '1.05rem',
            lineHeight: 1.75,
            color: 'rgba(240, 246, 236, 0.82)',
          }}
        >
          Plan crops, monitor disease signals, explore market insights, and manage your farm workflow from one clear workspace.
        </p>

        <div
          style={{
            margin: '2rem auto 0',
            maxWidth: 420,
            padding: '10px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, rgba(190, 232, 71, 0.34) 0%, rgba(203, 240, 94, 0.14) 50%, rgba(190, 232, 71, 0.3) 100%)',
            boxShadow: '0 18px 40px rgba(42, 84, 28, 0.2)',
            animation: 'outerGlow 2.8s ease-in-out infinite',
          }}
        >
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            style={{
              width: '100%',
              height: 60,
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.72)',
              background: 'linear-gradient(180deg, #f8ffd2 0%, #e4f461 100%)',
              color: '#1f2d16',
              fontSize: '1rem',
              fontWeight: 700,
              boxShadow: '0 12px 24px rgba(18, 30, 12, 0.16)',
              transition: 'transform 180ms ease, box-shadow 180ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 16px 30px rgba(18, 30, 12, 0.22)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(18, 30, 12, 0.16)'
            }}
            onClick={() => {
              signInWithGoogleMock()
              navigate('/profile')
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1d5fd0',
                fontWeight: 800,
                fontSize: '1.1rem',
                background: 'rgba(255,255,255,0.75)',
              }}
            >
              G
            </span>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes cardEnter {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.985);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes badgeFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes outerGlow {
          0%, 100% {
            box-shadow: 0 18px 40px rgba(42, 84, 28, 0.2);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 24px 48px rgba(42, 84, 28, 0.28);
            transform: scale(1.01);
          }
        }
      `}</style>
    </div>
  )
}
