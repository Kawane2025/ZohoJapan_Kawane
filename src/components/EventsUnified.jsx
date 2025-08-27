import React, { useEffect, useState } from "react";
import { getEvents } from "../lib/api";
import { useLang } from "./LanguageProvider";

export default function EventsUnified() {
  const { t, language } = useLang();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const all = await getEvents();
      const arr = Array.isArray(all) ? all : [];
      // current first, then earliest start_date
      const sorted = arr.sort((a, b) => {
        const cur = (b.is_current ? 1 : 0) - (a.is_current ? 1 : 0);
        if (cur !== 0) return cur;
        return String(a.start_date || "").localeCompare(
          String(b.start_date || "")
        );
      });
      setList(sorted);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const onRefresh = () => fetchEvents();
    window.addEventListener("events:refresh", onRefresh);
    return () => window.removeEventListener("events:refresh", onRefresh);
  }, []);

  const totalSlots = (ev) =>
    (ev.available_slots || []).reduce(
      (sum, s) => sum + (Number(s.total_slots) || 0),
      0
    );

  const fmtDate = (v) => {
    const d = new Date(v);
    if (isNaN(d)) return v;
    const locale = language === "ja" ? "ja-JP" : "en-US";
    const opts =
      language === "ja"
        ? { year: "numeric", month: "short", day: "numeric" }
        : { month: "short", day: "numeric", year: "numeric" };
    return d.toLocaleDateString(locale, opts);
  };

  return (
    <section id="events" className="section py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* <h3 className="text-3xl font-extrabold text-center mb-6 text-red-500">
          {t("events_title")}
        </h3> */}
<h3 className="text-5xl font-extrabold text-center mb-6 text-white drop-shadow">
  {t('events_title')}
</h3>


        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-zoho-blue rounded-full"></div>
            <span className="ml-3 text-gray-600"> {t("loading")} </span>
          </div>
        ) : (
          // stretch cards to equal height
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            {list.map((ev, idx) => (
              // make each card a flex column so footer can stick to bottom
              <div
                key={ev.id || idx}
                className="card p-0 overflow-hidden shadow-glow flex flex-col h-full"
              >
                {/* Header (kept) */}
                <div className="bg-gradient-to-r from-zoho-blue to-zoho-green text-white px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        ev.is_current ? "bg-green-600" : "bg-blue-600"
                      }`}
                    >
                      {ev.is_current ? t("current_label") : t("upcoming_label")}
                    </span>
                    <h4 className="text-xl font-semibold">
                      {language === "ja"
                        ? ev.title_ja || ev.title_en
                        : ev.title_en || ev.title_ja}
                    </h4>
                  </div>
                  <span className="text-sm opacity-90">
                    {fmtDate(ev.start_date)}
                  </span>
                </div>

                {/* Optional image below header */}
                {ev.image_url && (
                  <div className="w-full h-40 overflow-hidden">
                    <img
                      src={ev.image_url}
                      alt={ev.title_ja || ev.title_en}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Body -> flex column; description flex-1; footer aligned */}
                <div className="p-5 flex flex-col h-full">
                  <p className="text-gray-700 whitespace-pre-line flex-1">
                    {language === "ja"
                      ? ev.description_ja || ev.description_en
                      : ev.description_en || ev.description_ja}
                  </p>

                  {/* Footer row aligned & pinned to bottom */}
                  <div className="mt-4 pt-1 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {totalSlots(ev)} {t("total_slots")}
                    </span>
                    <a
                      href="#registration"
                      onClick={() => {
                        // preselect event in the form
                        window.dispatchEvent(
                          new CustomEvent("registration:preselect", {
                            detail: { eventId: ev.id },
                          })
                        );
                      }}
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white hover:brightness-110"
                    >
                      {t("register")}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
