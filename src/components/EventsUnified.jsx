import React,{useEffect,useState} from 'react'
import { motion } from 'framer-motion'
import { getEvents } from '../lib/api'
import { useLang } from './LanguageProvider'

export default function EventsUnified(){
  const { t } = useLang()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{(async()=>{ try{
    const all = await getEvents()
    setList(Array.isArray(all)?all:[])
  } finally { setLoading(false) }})()},[])

  const totalSlots = (ev) => (ev.available_slots || []).reduce((sum, s) => sum + (Number(s.remaining_slots)||0), 0)
  const fmtDate = (v) => { const d=new Date(v); return isNaN(d)?v: d.toLocaleDateString('ja-JP',{year:'numeric', month:'short', day:'numeric'}) }

  return (

    <section id="events" className="section py-16">
          {/* <div className="absolute inset-0 -z-10">
        <img src="https://tripeditor.com/wp-content/uploads/2021/10/31183831/23579768_m-min-1200x675.jpg" alt="Kawane" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />
   </div> */}
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-3xl font-extrabold text-center mb-6 text-red-500">イベント</h3>
        {loading && <p>イベント</p>}
        {!loading && (
          <div className="grid md:grid-cols-2 gap-6">
            {list.map((ev, idx) => (
              <motion.div key={ev.id || idx} initial={{opacity:0, y:8}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.4}} className="card p-0 overflow-hidden shadow-glow">
                <div className="bg-gradient-to-r from-zoho-blue to-zoho-green text-white px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${ev.is_current ? 'bg-green-600' : 'bg-blue-600'}`}>{ev.is_current ? t('current_label') : t('upcoming_label')}</span>
                    <h4 className="text-xl font-semibold">{ev.title_ja || ev.title_en}</h4>
                  </div>
                  <span className="text-sm opacity-90">{fmtDate(ev.start_date)}</span>
                </div>
                <div className="p-5">
                  <p className="text-gray-700 mb-4">{ev.description_ja || ev.description_en}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{totalSlots(ev)} {t('total_slots')}</span>
                    <a href="#registration" className="inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white hover:brightness-110">{t('register')}</a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}