// import React, { useEffect } from 'react'
// import { LanguageProvider } from '../components/LanguageProvider'
// import Navigation from '../components/Navigation'
// // import Hero from '../components/Hero'
// import EventsUnified from '../components/EventsUnified'
// import RegistrationForm from '../components/RegistrationForm'
// import PhotoGallery from '../components/PhotoGallery'
// import Footer from '../components/Footer'
// import MoreButtons from '../components/MoreButtons'

// export default function Home(){
//   useEffect(() => {
//     const p = new URLSearchParams(window.location.search);
//     const go = p.get('go');
//     const ev = p.get('event');
//     if (go === 'register' || window.location.hash === '#registration') {
//       setTimeout(() => { document.querySelector('#registration')?.scrollIntoView({ behavior: 'smooth' }) }, 300);
//     }
//     if (ev) { window.__preselectEvent = ev }
//   }, [])

//   return (
//     <LanguageProvider>
//       <div className="min-h-screen flex flex-col">
//         <Navigation/>
//         <main className="flex-1">
//           {/* <Hero/> */}
//           {/* <section className="bg-white"><EventsUnified/></section> */}
//            <section className="bg-white events-bg">
//     <div className="lg:bg-white/60">
//    <div className="py-8 lg:py-16">
//        <EventsUnified/>
//      </div>
//   </div> </section>

//           <section className="bg-white"><RegistrationForm/></section>
//           <section className="bg-white"><PhotoGallery/></section>
//           <section className="bg-white"><MoreButtons/></section>
//         </main>
//         <Footer/>
//       </div>
//     </LanguageProvider>
//   )
// }
import React, { useEffect } from 'react'
import { LanguageProvider } from '../components/LanguageProvider'
import Navigation from '../components/Navigation'
// import Hero from '../components/Hero'
import EventsUnified from '../components/EventsUnified'
import RegistrationForm from '../components/RegistrationForm'
import PhotoGallery from '../components/PhotoGallery'
import Footer from '../components/Footer'
import MoreButtons from '../components/MoreButtons'

export default function Home(){
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const go = p.get('go');
    const ev = p.get('event');
    if (go === 'register' || window.location.hash === '#registration') {
      setTimeout(() => { document.querySelector('#registration')?.scrollIntoView({ behavior: 'smooth' }) }, 300);
    }
    if (ev) { window.__preselectEvent = ev }
  }, [])

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation/>
        <main className="flex-1">
          {/* Hero removed */}
          
          {/* ✅ Desktop-only background behind Events */}
          <section id="events" className="events-bg">
            <div className="py-8 lg:py-16">
              <EventsUnified/>
            </div>
          </section>

          <section className="bg-white"><RegistrationForm/></section>
          <section className="bg-white"><PhotoGallery/></section>
          <section className="bg-white"><MoreButtons/></section>
        </main>
        <Footer/>
      </div>
    </LanguageProvider>
  )
}
