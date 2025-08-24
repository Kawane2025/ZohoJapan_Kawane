import React,{useState} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from './LanguageProvider'
import { Globe, Menu } from 'lucide-react'
import images from '../config/images'

export default function Navigation(){
  const { language, toggleLanguage, t } = useLang()
  const [open, setOpen] = useState(false)
  const otherLangLabel = language === 'ja' ? 'EN' : '日本語'
  const NavLink = ({href, children}) => (<a href={href} className="px-3 py-2 hover:text-zoho-blue text-gray-800">{children}</a>)
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 font-semibold text-zoho-navy">
            <img src={images.logo} alt="Zoho" className="h-7 w-auto" />
            <span>ゾーホージャパン川根本</span>
          </a>
          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="#events">{t('nav_events')}</NavLink>
            <NavLink href="#registration">{t('nav_registration')}</NavLink>
            <NavLink href="#gallery">{t('nav_gallery')}</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggleLanguage} className="inline-flex items-center gap-1 px-3 py-2 text-sm border rounded-lg">
              <Globe size={16}/> {otherLangLabel}
            </button>
            <button className="md:hidden p-2" onClick={()=>setOpen(v=>!v)} aria-label="Open menu"><Menu/></button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="md:hidden border-t py-3 space-y-2">
              <div className="flex flex-col">
                <a href="#events" className="px-3 py-2">{language==='ja' ? 'イベント' : 'Events'}</a>
                <a href="#registration" className="px-3 py-2">{language==='ja' ? '登録' : 'Registration'}</a>
                <a href="#gallery" className="px-3 py-2">{language==='ja' ? 'ギャラリー' : 'Photo Gallery'}</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}