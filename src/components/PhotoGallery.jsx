import React,{useState} from 'react'
import images from '../config/images'
import { useLang } from './LanguageProvider'

export default function PhotoGallery(){
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [src, setSrc] = useState(null)
  const list = images.gallery
  const onOpen = (s)=>{ setSrc(s); setOpen(true) }
  const onClose = ()=> setOpen(false)

  return (
    <section id="gallery" className="section py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('gallery_title')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {list.map((s,i)=>(
            <button key={i} onClick={()=>onOpen(s)} className="group relative rounded-xl overflow-hidden shadow">
              <img src={s} alt={"Gallery "+(i+1)} className="w-full h-44 md:h-56 object-cover group-hover:scale-105 transition" loading="lazy"/>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
          <img src={src} alt="preview" className="max-h-[85vh] max-w-[90vw] rounded-xl shadow-glow" />
        </div>
      )}
    </section>
  )
}