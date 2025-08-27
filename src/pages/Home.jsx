import React, { useEffect } from "react";
import { LanguageProvider } from "../components/LanguageProvider";
import Navigation from "../components/Navigation";
import EventsUnified from "../components/EventsUnified";
import RegistrationForm from "../components/RegistrationForm";
import PhotoGallery from "../components/PhotoGallery";
import Footer from "../components/Footer";
import MoreButtons from "../components/MoreButtons";

export default function Home() {
  useEffect(() => {
  const search = new URLSearchParams(window.location.search);
  const go = search.get("go");
  const hash = window.location.hash;

  const pending = (go === "register") || (hash === "#registration");
  if (!pending) return;

  function scrollWithOffset() {
    const el = document.querySelector("#registration");
    if (!el) return false;

    // measure sticky header (adjust selector to your header id/class)
    const header = document.querySelector("nav, header, #site-header");
    const offset = header ? header.getBoundingClientRect().height + 12 : 80;

    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    return true;
  }

  // try immediately, then a few retries (in case the form mounts a bit later)
  let tries = 0;
  const tryNow = () => {
    if (scrollWithOffset() || tries > 20) return; // ~2s max
    tries += 1;
    setTimeout(tryNow, 100);
  };
  tryNow();

  // re-run after events finish loading or refresh (prevents “half covered”)
  const onLoaded = () => { setTimeout(scrollWithOffset, 50); };
  window.addEventListener("events:loaded", onLoaded);
  window.addEventListener("events:refresh", onLoaded);

  // if it was query-only, add the hash for bookmarking (no reload)
  if (go === "register" && hash !== "#registration") {
    history.replaceState(null, "", "#registration");
  }

  return () => {
    window.removeEventListener("events:loaded", onLoaded);
    window.removeEventListener("events:refresh", onLoaded);
  };
}, []);


  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          {/* Hero removed */}

          <section id="events" className="events-bg">
            <div className="py-8 lg:py-16">
              <EventsUnified />
            </div>
          </section>

          <section className="bg-white">
            <RegistrationForm />
          </section>
          <section className="bg-white">
            <PhotoGallery />
          </section>
          <section className="bg-white">
            <MoreButtons />
          </section>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
