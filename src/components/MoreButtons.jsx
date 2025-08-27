import React from 'react'
import { useLang } from './LanguageProvider'

export default function MoreButtons(){
  const { t, } = useLang()
  return (
    <section id="more" className="section py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4">
        <a href="https://www.zoho.co.jp/kawanehoncho/" target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:brightness-110 shadow-glow">
          {t('footer_more_kawane')}
        </a>
        <a href="https://www.zoho.co.jp" target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:brightness-110 shadow-glow">
          {t('footer_more_zoho')}
        </a>
      </div>
    </section>
  )
}
