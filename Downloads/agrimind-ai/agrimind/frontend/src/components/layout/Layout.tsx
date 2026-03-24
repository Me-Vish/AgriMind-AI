import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useState } from 'react'
import type { Language } from '../../i18n'

export default function Layout() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('agrimind-language')
    return saved === 'ta' || saved === 'hi' ? saved : 'en'
  })

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('agrimind-language', lang)
  }

  return (
    <div className="app-container">
      <Sidebar language={language} />
      <div className="main-content">
        <Topbar language={language} onLanguageChange={handleLanguageChange} />
        <main className="page-body">
          <Outlet context={{ language }} />
        </main>
      </div>
    </div>
  )
}
