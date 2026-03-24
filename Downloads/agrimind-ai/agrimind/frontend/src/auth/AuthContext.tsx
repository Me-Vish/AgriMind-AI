import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export interface UserProfile {
  name: string
  email: string
  avatar: string
  avatarUrl?: string
  phone: string
  location: string
  preferredLanguage: string
  farmSize: string
  bio: string
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Farmer Admin',
  email: 'farmer@agrimind.ai',
  avatar: 'FA',
  phone: '+91 98765 43210',
  location: 'Tamil Nadu, India',
  preferredLanguage: 'en',
  farmSize: '12 acres',
  bio: 'Progressive farmer using AgriMind for crop planning, disease monitoring, and market tracking.',
}

interface AuthContextValue {
  user: UserProfile | null
  signInWithGoogleCredential: (credential: string) => void
  signInWithGoogleMock: () => void
  updateProfile: (updates: Partial<UserProfile>) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const STORAGE_KEY = 'agrimind-user'

function decodeJwtPayload(credential: string) {
  const payload = credential.split('.')[1]
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4)
  const decoded = atob(padded)
  return JSON.parse(decoded)
}

function buildUserFromGoogleCredential(credential: string): UserProfile {
  const payload = decodeJwtPayload(credential)
  const name = payload.name || 'Farmer'
  const email = payload.email || ''
  const picture = payload.picture || ''
  const initials = name.split(' ').map((part: string) => part[0]).join('').slice(0, 2).toUpperCase()

  return {
    ...DEFAULT_USER_PROFILE,
    name,
    email,
    avatar: initials,
    avatarUrl: picture,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const persist = (next: UserProfile | null) => {
    setUser(next)
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    signInWithGoogleCredential: (credential) => {
      const next = buildUserFromGoogleCredential(credential)
      persist(next)
    },
    signInWithGoogleMock: () => {
      persist(DEFAULT_USER_PROFILE)
    },
    updateProfile: (updates) => {
      const next = { ...(user ?? DEFAULT_USER_PROFILE), ...updates }
      persist(next)
    },
    signOut: () => {
      persist(null)
      window.google?.accounts.id.disableAutoSelect()
    },
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
