import React from 'react'
import { motion } from 'framer-motion'
import images from '../config/images'
import { useLang } from './LanguageProvider'

export default function Hero(){
  // const { t } = useLang()
  // return (
  //   <section className="relative overflow-hidden">
  //     <div className="absolute inset-0 -z-10">
  //       <img src="https://tripeditor.com/wp-content/uploads/2021/10/31183831/23579768_m-min-1200x675.jpg" alt="Kawane" className="w-full h-full object-cover" />
  //       <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />
  //     </div>
  //     <div className="max-w-6xl mx-auto px-4 py-24 md:py-36 grid md:grid-cols-2 gap-10 items-center text-white">
  //       <motion.div initial={{y:20, opacity:0}} whileInView={{y:0, opacity:1}} viewport={{once:true}} transition={{duration:.6}}>
  //         <h1 className="text-4xl md:text-6xl font-extrabold">{t('hero_title')}</h1>
  //         <p className="text-lg opacity-90 mt-4 mb-6">{t('hero_desc')}</p>
  //         <a href="#registration" className="inline-flex items-center px-5 py-3 rounded-xl bg-zoho-navy text-white hover:opacity-90 transition">{t('hero_cta')}</a>
  //       </motion.div>
  //     </div>
  //   </section>
  // )
}