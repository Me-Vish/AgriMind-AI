import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, UserRound, Mail, Phone, MapPin, Languages, Tractor } from 'lucide-react'
import { DEFAULT_USER_PROFILE, useAuth } from '../auth/AuthContext'

export default function Profile() {
  const navigate = useNavigate()
  const { user, updateProfile, signOut } = useAuth()
  const profile = user ?? DEFAULT_USER_PROFILE
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    preferredLanguage: profile.preferredLanguage,
    farmSize: profile.farmSize,
    bio: profile.bio,
  })

  useEffect(() => {
    setForm({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      preferredLanguage: profile.preferredLanguage,
      farmSize: profile.farmSize,
      bio: profile.bio,
    })
  }, [profile.bio, profile.email, profile.farmSize, profile.location, profile.name, profile.phone, profile.preferredLanguage])

  const handleChange = (key: string, value: string) => {
    setSaved(false)
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({
      ...form,
      avatar: form.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(),
    })
    setSaved(true)
  }

  const handleLogout = () => {
    signOut()
    navigate('/signin')
  }

  return (
    <div style={{ maxWidth: 1080, display: 'grid', gridTemplateColumns: '320px 1fr', gap: 'var(--space-6)' }}>
      <div className="card">
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, overflow: 'hidden' }}>
            {user?.avatarUrl
              ? <img src={user.avatarUrl} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (user?.avatar ?? profile.avatar)}
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>{form.name}</h2>
            <p style={{ color: 'var(--color-gray-500)' }}>{form.email}</p>
          </div>
          <div style={{ width: '100%', display: 'grid', gap: '0.8rem', marginTop: '0.6rem' }}>
            <ProfileStat icon={<MapPin size={16} color="var(--color-primary)" />} text={form.location || 'Add your location'} />
            <ProfileStat icon={<Languages size={16} color="var(--color-primary)" />} text={form.preferredLanguage.toUpperCase()} />
            <ProfileStat icon={<Tractor size={16} color="var(--color-primary)" />} text={form.farmSize || 'Add farm size'} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Update Profile</span>
          {saved && <span className="badge badge-success">Saved</span>}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
            <div className="grid-2">
              <Field label="Full Name" icon={<UserRound size={15} />} value={form.name} onChange={value => handleChange('name', value)} />
              <Field label="Email Address" icon={<Mail size={15} />} value={form.email} onChange={value => handleChange('email', value)} />
            </div>
            <div className="grid-2">
              <Field label="Phone Number" icon={<Phone size={15} />} value={form.phone} onChange={value => handleChange('phone', value)} />
              <Field label="Location" icon={<MapPin size={15} />} value={form.location} onChange={value => handleChange('location', value)} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Preferred Language</label>
                <select className="form-input" value={form.preferredLanguage} onChange={e => handleChange('preferredLanguage', e.target.value)}>
                  <option value="en">English</option>
                  <option value="ta">Tamil</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
              <Field label="Farm Size" icon={<Tractor size={15} />} value={form.farmSize} onChange={value => handleChange('farmSize', value)} />
            </div>
            <div className="form-group">
              <label className="form-label">About You</label>
              <textarea
                value={form.bio}
                onChange={e => handleChange('bio', e.target.value)}
                rows={5}
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 14,
                  resize: 'vertical',
                  fontFamily: 'var(--font-sans)',
                  background: 'var(--color-white)',
                  color: 'var(--color-gray-900)',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <p style={{ color: 'var(--color-gray-500)', lineHeight: 1.6 }}>
                Google sign-in fills your basic details automatically, and any changes you save here update your profile immediately.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button type="button" className="btn btn-secondary btn-lg" onClick={handleLogout}>
                  Log out
                </button>
                <button type="submit" className="btn btn-primary btn-lg">
                  <Save size={16} /> Update Profile
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function Field({ label, icon, value, onChange }: { label: string, icon: React.ReactNode, value: string, onChange: (value: string) => void }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }}>
          {icon}
        </div>
        <input className="form-input" value={value} onChange={e => onChange(e.target.value)} style={{ paddingLeft: 38 }} />
      </div>
    </div>
  )
}

function ProfileStat({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', borderRadius: 16, background: 'var(--color-gray-50)', color: 'var(--color-gray-700)' }}>
      {icon}
      <span>{text}</span>
    </div>
  )
}
