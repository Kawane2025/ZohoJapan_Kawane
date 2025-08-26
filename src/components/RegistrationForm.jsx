import React, { useEffect, useMemo, useState } from "react";
import { createRegistration, getEvents } from "../lib/api";
import { COMPANY } from "../config/company";
import { useLang } from "./LanguageProvider";
import { format } from "date-fns";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

export default function RegistrationForm() {
  function makeConfetti() {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.inset = "0";
    container.style.pointerEvents = "none";
    container.style.zIndex = "9999";
    for (let i = 0; i < 80; i++) {
      const s = document.createElement("span");
      const size = 6 + Math.random() * 8;
      s.style.position = "absolute";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = "-10px";
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.background = ["#4285F4", "#34A853", "#FBBC05", "#EA4335"][i % 4];
      s.style.opacity = 0.9;
      s.style.borderRadius = "2px";
      s.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      const dur = 2000 + Math.random() * 2000;
      s.animate(
        [
          { transform: s.style.transform + " translateY(0)", opacity: 1 },
          { transform: s.style.transform + " translateY(110vh)", opacity: 0.9 },
        ],
        {
          duration: dur,
          easing: "cubic-bezier(.2,.7,.3,1)",
          delay: Math.random() * 600,
        }
      );
      container.appendChild(s);
      setTimeout(() => s.remove(), dur + 800);
    }
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 4200);
  }
  const { t, language } = useLang();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    event_id: "",
    participant_count: 1,
    preferred_date: "",
    notes: "",
    additional_names: [],
    consent_given: true,
    trap: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState(null);

  // Load events
  useEffect(() => {
    (async () => {
      try {
        const data = await getEvents();
        setEvents(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  // Preselect event from QR (?event=...)
  useEffect(() => {
    if (window.__preselectEvent)
      setForm((f) => ({ ...f, event_id: window.__preselectEvent }));
  }, []);

  const selected = useMemo(
    () => events.find((e) => e.id === form.event_id),
    [events, form.event_id]
  );
  const slotOptions = useMemo(
    () =>
      (selected?.available_slots || []).map((s) => ({
        value: `${s.date}||${s.time || ""}`,
        label: `${format(new Date(s.date), "PP")}${
          s.time ? " • " + s.time : ""
        } (${s.total_slots} slots)`,
      })),
    [selected]
  );

  // Auto-select first slot when event picked and no date yet
  useEffect(() => {
    if (selected && !form.preferred_date && slotOptions.length > 0)
      setForm((f) => ({ ...f, preferred_date: slotOptions[0].value }));
  }, [selected, slotOptions]);

  useEffect(() => {
    const handler = (e) => {
      const id = e?.detail?.eventId;
      if (!id) return;

      // set the selected event id
      setForm((f) => ({ ...f, event_id: id }));

      // find that event and preselect first available date/time
      const ev = events.find((x) => x.id === id);
      if (
        ev &&
        Array.isArray(ev.available_slots) &&
        ev.available_slots.length > 0
      ) {
        const s0 = ev.available_slots[0];
        const preferred = [s0.date, s0.time].filter(Boolean).join("||");
        setForm((f) => ({ ...f, preferred_date: preferred }));
      }

      // (optional) smooth-scroll, in case user clicked from somewhere else
      document
        .querySelector("#registration")
        ?.scrollIntoView({ behavior: "smooth" });
    };

    window.addEventListener("registration:preselect", handler);
    return () => window.removeEventListener("registration:preselect", handler);
  }, [events]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    if (name === "event_id") setForm((f) => ({ ...f, preferred_date: "" }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (form.trap) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await createRegistration(form);
      if (res && res.ok) {
        setOk(true);

        // optional confetti / success UI here…

        // ✅ Tell Events section to refetch (update vacancy display)
        window.dispatchEvent(new Event("events:refresh"));
      } else throw new Error("Failed");
    } catch (err) {
      console.error(err);
      setError("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (ok) {
    return (
      <section className="py-20" id="registration">
        <div className="max-w-3xl mx-auto px-4">
          <div className="card p-10 text-center shadow-glow bg-gradient-to-br from-zoho-blue/10 to-zoho-green/10">
            <h3 className="text-3xl font-semibold mb-2">{t("thanks_title")}</h3>
            <p className="text-gray-600">{t("thanks_desc")}</p>
            <div className="mt-6">
              <a
                href={"https://maps.app.goo.gl/bQBev61zubYmjPSN9"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-3 rounded-xl bg-blue-600 text-white hover:brightness-110"
              >
                View Event Location
              </a>
            </div>
            <div className="mt-4">
              <a
                href="#events"
                className="inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                {t("back_events")}
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section py-20" id="registration">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold">{t("reg_title")}</h2>
          <p className="text-gray-600 mt-2">{t("reg_desc")}</p>
        </div>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={submit} className="card shadow-glow overflow-hidden">
          <div className="bg-gradient-to-r from-zoho-blue to-zoho-green text-white px-6 py-4 text-lg font-semibold">
            Registration Form
          </div>
          <div className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Name */}
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder={t("name")}
                className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
                required
              />

              {/* Phone with country code */}
              <PhoneInput
                international
                defaultCountry="JP"
                value={form.phone}
                onChange={(val) => setForm((f) => ({ ...f, phone: val || "" }))}
                className="w-full"
                numberInputProps={{
                  className:
                    "border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none w-full",
                }}
                countrySelectProps={{
                  className: "rounded-l-xl",
                }}
                placeholder={language === "ja" ? "電話番号" : "Phone number"}
              />
            </div>

            {/* Email row (full width) */}
            <div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder={t("email")}
                className="w-full border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <select
                name="event_id"
                value={form.event_id}
                onChange={onChange}
                className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
                required
              >
                <option value="">{t("select_event")}</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title_ja || ev.title_en}
                  </option>
                ))}
              </select>
              <select
                name="preferred_date"
                value={form.preferred_date}
                onChange={onChange}
                className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
                required
              >
                <option value="">{t("select_date")}</option>
                {slotOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="participant_count"
                type="number"
                min="1"
                max="6"
                value={form.participant_count}
                onChange={(e) => {
                  const n = Math.max(
                    1,
                    Math.min(6, Number(e.target.value || 1))
                  );
                  // grow/shrink extra names array to n-1
                  setForm((f) => ({
                    ...f,
                    participant_count: n,
                    additional_names: Array.from(
                      { length: Math.max(0, n - 1) },
                      (_, i) => f.additional_names?.[i] || ""
                    ),
                  }));
                }}
                placeholder={t("participants")}
                className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
              />

              <input
                name="notes"
                value={form.notes}
                onChange={onChange}
                placeholder={t("notes")}
                className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
              />
            </div>

            {/* extra participant names */}
            {form.participant_count > 1 && (
              <div className="space-y-3">
                {form.additional_names.map((val, idx) => (
                  <input
                    key={idx}
                    value={val}
                    onChange={(e) => {
                      const copy = [...form.additional_names];
                      copy[idx] = e.target.value;
                      setForm((f) => ({ ...f, additional_names: copy }));
                    }}
                    className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none w-full"
                    placeholder={
                      language === "ja"
                        ? `追加参加者${idx + 1}の氏名`
                        : `Name of additional participant ${idx + 1}`
                    }
                    required
                  />
                ))}
              </div>
            )}

            <label className="flex items-center gap-2 text-sm">
              <input
                name="consent_given"
                type="checkbox"
                checked={form.consent_given}
                onChange={onChange}
              />
              I consent to handling of my personal information.
            </label>
            <div className="flex justify-end">
              <button
                disabled={submitting}
                className="btn-brand disabled:opacity-50"
              >
                {submitting ? t("submitting") : t("submit")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
