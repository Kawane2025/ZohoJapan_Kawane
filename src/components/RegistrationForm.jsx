// // import React, { useEffect, useMemo, useState } from "react";
// // import { createRegistration, getEvents } from "../lib/api";
// // import { COMPANY } from "../config/company";
// // import { useLang } from "./LanguageProvider";
// // import { format } from "date-fns";
// // import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

// // export default function RegistrationForm() {
// //   function makeConfetti() {
// //     const container = document.createElement("div");
// //     container.style.position = "fixed";
// //     container.style.inset = "0";
// //     container.style.pointerEvents = "none";
// //     container.style.zIndex = "9999";
// //     for (let i = 0; i < 80; i++) {
// //       const s = document.createElement("span");
// //       const size = 6 + Math.random() * 8;
// //       s.style.position = "absolute";
// //       s.style.left = Math.random() * 100 + "%";
// //       s.style.top = "-10px";
// //       s.style.width = size + "px";
// //       s.style.height = size + "px";
// //       s.style.background = ["#4285F4", "#34A853", "#FBBC05", "#EA4335"][i % 4];
// //       s.style.opacity = 0.9;
// //       s.style.borderRadius = "2px";
// //       s.style.transform = "rotate(" + Math.random() * 360 + "deg)";
// //       const dur = 2000 + Math.random() * 2000;
// //       s.animate(
// //         [
// //           { transform: s.style.transform + " translateY(0)", opacity: 1 },
// //           { transform: s.style.transform + " translateY(110vh)", opacity: 0.9 },
// //         ],
// //         {
// //           duration: dur,
// //           easing: "cubic-bezier(.2,.7,.3,1)",
// //           delay: Math.random() * 600,
// //         }
// //       );
// //       container.appendChild(s);
// //       setTimeout(() => s.remove(), dur + 800);
// //     }
// //     document.body.appendChild(container);
// //     setTimeout(() => container.remove(), 4200);
// //   }
// //   const { t, language } = useLang();
// //   const [events, setEvents] = useState([]);
// //   const [form, setForm] = useState({
// //     name: "",
// //     email: "",
// //     phone: "",
// //     event_id: "",
// //     participant_count: 1,
// //     preferred_date: "",
// //     notes: "",
// //     additional_names: [],
// //     consent_given: true,
// //     trap: "",
// //   });
// //     const MAX_PARTICIPANTS = 6;
// //   const [participantError, setParticipantError] = useState("");
// //   const [phoneError, setPhoneError] = useState("");
// //   const [submitting, setSubmitting] = useState(false);
// //   const [ok, setOk] = useState(false);
// //   const [error, setError] = useState(null);

// //   // Load events
// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const data = await getEvents();
// //         setEvents(Array.isArray(data) ? data : []);
// //       } catch (e) {
// //         console.error(e);
// //       }
// //     })();
// //   }, []);

// //   // Preselect event from QR (?event=...)
// //   useEffect(() => {
// //     if (window.__preselectEvent)
// //       setForm((f) => ({ ...f, event_id: window.__preselectEvent }));
// //   }, []);

// //   const selected = useMemo(
// //     () => events.find((e) => e.id === form.event_id),
// //     [events, form.event_id]
// //   );
// //   const slotOptions = useMemo(
// //     () =>
// //       (selected?.available_slots || []).map((s) => ({
// //         value: `${s.date}||${s.time || ""}`,
// //         label: `${format(new Date(s.date), "PP")}${
// //           s.time ? " • " + s.time : ""
// //         } (${s.remaining_slots} slots)`,
// //       })),
// //     [selected]
// //   );

// //   // Auto-select first slot when event picked and no date yet
// //   useEffect(() => {
// //     if (selected && !form.preferred_date && slotOptions.length > 0)
// //       setForm((f) => ({ ...f, preferred_date: slotOptions[0].value }));
// //   }, [selected, slotOptions]);

// //   useEffect(() => {
// //     const handler = (e) => {
// //       const id = e?.detail?.eventId;
// //       if (!id) return;

// //       // set the selected event id
// //       setForm((f) => ({ ...f, event_id: id }));

// //       // find that event and preselect first available date/time
// //       const ev = events.find((x) => x.id === id);
// //       if (
// //         ev &&
// //         Array.isArray(ev.available_slots) &&
// //         ev.available_slots.length > 0
// //       ) {
// //         const s0 = ev.available_slots[0];
// //         const preferred = [s0.date, s0.time].filter(Boolean).join("||");
// //         setForm((f) => ({ ...f, preferred_date: preferred }));
// //       }

// //       // (optional) smooth-scroll, in case user clicked from somewhere else
// //       document
// //         .querySelector("#registration")
// //         ?.scrollIntoView({ behavior: "smooth" });
// //     };

// //     window.addEventListener("registration:preselect", handler);
// //     return () => window.removeEventListener("registration:preselect", handler);
// //   }, [events]);

// //   const onChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
// //     if (name === "event_id") setForm((f) => ({ ...f, preferred_date: "" }));
// //   };

// //   const submit = async function submit(e) {
// //   e.preventDefault();

// //   // normalize participants
// //   let n = parseInt(form.participant_count || "0", 10);
// //   if (!n || isNaN(n)) n = 1;
// //   if (n < 1) n = 1;
// //   if (n > MAX_PARTICIPANTS) {
// //     setParticipantError(
// //       language === "ja"
// //         ? `一度に登録できるのは最大 ${MAX_PARTICIPANTS} 名です。`
// //         : `Maximum ${MAX_PARTICIPANTS} participants per registration.`
// //     );
// //     return; // stop submit if invalid
// //   }

// //   // build array of extra participant names
// //   const additional = Array.from(
// //     { length: Math.max(0, n - 1) },
// //     (_, i) => (form.additional_names?.[i] || "").trim()
// //   ).filter(Boolean);

// //   // ✅ final payload for Apps Script
// //   const payload = {
// //     ...form,
// //     participant_count: n,     // send as number
// //     additional_names: additional,
// //   };

// //   try {
// //     await createRegistration(payload);
// //     // TODO: reset form, show thank-you, scroll etc.
// //   } catch (err) {
// //     console.error("Registration failed", err);
// //   }

// //     finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   if (ok) {
// //     return (
// //       <section className="py-20" id="registration">
// //         <div className="max-w-3xl mx-auto px-4">
// //           <div className="card p-10 text-center shadow-glow bg-gradient-to-br from-zoho-blue/10 to-zoho-green/10">
// //             <h3 className="text-3xl font-semibold mb-2">{t("thanks_title")}</h3>
// //             <p className="text-gray-600">{t("thanks_desc")}</p>
// //             <div className="mt-6">
// //               <a
// //                 href={"https://maps.app.goo.gl/bQBev61zubYmjPSN9"}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //                 className="inline-flex items-center px-5 py-3 rounded-xl bg-blue-600 text-white hover:brightness-110"
// //               >
// //                 View Event Location
// //               </a>
// //             </div>
// //             <div className="mt-4">
// //               <a
// //                 href="#events"
// //                 className="inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50"
// //               >
// //                 {t("back_events")}
// //               </a>
// //             </div>
// //           </div>
// //         </div>
// //       </section>
// //     );
// //   }

// //   return (
// //     <section className="section py-20" id="registration">
// //       <div className="max-w-3xl mx-auto px-4">
// //         <div className="text-center mb-8">
// //           <h2 className="text-4xl font-extrabold">{t("reg_title")}</h2>
// //           <p className="text-gray-600 mt-2">{t("reg_desc")}</p>
// //         </div>

// //         {error && <p className="text-red-600 mb-3">{error}</p>}

// //         <form onSubmit={submit} className="card shadow-glow overflow-hidden">

// //           <div className="bg-gradient-to-r from-zoho-blue to-zoho-green text-white px-6 py-4 text-lg font-semibold"> {t("reg_heading")}

// //           </div>
// //           <div className="p-6 space-y-4">
// //             <div className="grid md:grid-cols-2 gap-4">
// //               {/* Name */}
// //               <input
// //                 name="name"
// //                 value={form.name}
// //                 onChange={onChange}
// //                 placeholder={t("name")}
// //                 className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
// //                 required
// //               />

// //               {/* Phone with country code */}
// //               <PhoneInput
// //                 international
// //                 defaultCountry="JP"
// //                 value={form.phone}
// //                 onChange={(val) => setForm((f) => ({ ...f, phone: val || "" }))}
// //                 className="w-full"
// //                 numberInputProps={{
// //                   className:
// //                     "border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none w-full",
// //                 }}
// //                 countrySelectProps={{
// //                   className: "rounded-l-xl",
// //                 }}
// //                  placeholder={t("number")}
// //                // placeholder={language === "ja" ? "電話番号" : "Phone number"}
// //               />
// //             </div>

// //             {/* Email row (full width) */}
// //             <div>
// //               <input
// //                 name="email"
// //                 type="email"
// //                 value={form.email}
// //                 onChange={onChange}
// //                 placeholder={t("email")}
// //                 className="w-full border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
// //                 required
// //               />
// //             </div>

// //             <div className="grid md:grid-cols-2 gap-4">
// //               <select
// //                 name="event_id"
// //                 value={form.event_id}
// //                 onChange={onChange}
// //                 className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
// //                 required
// //               >
// //                 <option value="">{t("select_event")}</option>
// //                 {events.map((ev) => (
// //                   <option key={ev.id} value={ev.id}>
// //                     {ev.title_ja || ev.title_en}
// //                   </option>
// //                 ))}
// //               </select>
// //               <select
// //                 name="preferred_date"
// //                 value={form.preferred_date}
// //                 onChange={onChange}
// //                 className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
// //                 required
// //               >
// //                 <option value="">{t("select_date")}</option>
// //                 {slotOptions.map((opt) => (
// //                   <option key={opt.value} value={opt.value}>
// //                     {opt.label}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>

// //             {/* <div className="grid md:grid-cols-2 gap-4">
// //               <input
// //                 name="participant_count"
// //                 type="number"
// //                 min="1"
// //                 max="6"
// //                 value={form.participant_count}
// //                 onChange={(e) => {
// //                   const n = Math.max(
// //                     1,
// //                     Math.min(6, Number(e.target.value || 1))
// //                   );
// //                   // grow/shrink extra names array to n-1
// //                   setForm((f) => ({
// //                     ...f,
// //                     participant_count: n,
// //                     additional_names: Array.from(
// //                       { length: Math.max(0, n - 1) },
// //                       (_, i) => f.additional_names?.[i] || ""
// //                     ),
// //                   }));
// //                 }}
// //                 placeholder={t("participants")}
// //                 className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
// //               /> */}
// // <div className="grid md:grid-cols-2 gap-4">
// //   {/* Participants (free text, mobile friendly) */}
// //   <div>
// //     <input
// //       name="participant_count"
// //       type="tel"                // better mobile keypad, no spinner
// //       inputMode="numeric"
// //       pattern="[0-9]*"
// //       value={String(form.participant_count ?? "")}
// //       onChange={(e) => {
// //         const raw = e.target.value;

// //         // allow empty while typing
// //         if (raw === "") {
// //           setForm((f) => ({ ...f, participant_count: "" }));
// //           setParticipantError("");
// //           return;
// //         }

// //         // allow only digits
// //         if (!/^\d+$/.test(raw)) return;

// //         const n = parseInt(raw, 10);

// //         // live error for > MAX
// //         if (n > MAX_PARTICIPANTS) {
// //           setParticipantError(
// //             language === "ja"
// //               ? `一度に登録できるのは最大 ${MAX_PARTICIPANTS} 名です。`
// //               : `Maximum ${MAX_PARTICIPANTS} participants per registration.`
// //           );
// //         } else if (n < 1) {
// //           setParticipantError(
// //             language === "ja" ? "1 以上を入力してください。" : "Please enter at least 1."
// //           );
// //         } else {
// //           setParticipantError("");
// //         }

// //         // update form value
// //         setForm((f) => ({ ...f, participant_count: raw }));

// //         // keep additional_names aligned when valid (1..MAX)
// //         if (n >= 1 && n <= MAX_PARTICIPANTS) {
// //           setForm((f) => ({
// //             ...f,
// //             participant_count: raw,
// //             additional_names: Array.from(
// //               { length: Math.max(0, n - 1) },
// //               (_, i) => f.additional_names?.[i] || ""
// //             ),
// //           }));
// //         }
// //       }}
// //       onBlur={() => {
// //         // normalize on blur
// //         let n = parseInt(form.participant_count || "0", 10);
// //         if (!n || isNaN(n)) n = 1;
// //         if (n < 1) n = 1;
// //         if (n > MAX_PARTICIPANTS) n = MAX_PARTICIPANTS;

// //         setForm((f) => ({
// //           ...f,
// //           participant_count: String(n),
// //           additional_names: Array.from(
// //             { length: Math.max(0, n - 1) },
// //             (_, i) => f.additional_names?.[i] || ""
// //           ),
// //         }));
// //         setParticipantError("");
// //       }}
// //       placeholder={language === "ja" ? "参加人数" : "No. of participants"}
// //       className={[
// //         "w-full border rounded-xl px-3 py-3 outline-none focus:ring-2",
// //         participantError ? "border-red-500 focus:ring-red-400" : "focus:ring-zoho-blue"
// //       ].join(" ")}
// //     />
// //     {participantError && (
// //       <div className="mt-1 text-sm text-red-600">{participantError}</div>
// //     )}
// //   </div>

// //   {/* Notes (or your other second-column field) */}
// //   <input
// //     name="notes"
// //     value={form.notes || ""}
// //     onChange={onChange}
// //     placeholder={t("notes")}
// //     className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
// //   />
// // </div>
// //               <input
// //                 name="notes"
// //                 value={form.notes}
// //                 onChange={onChange}
// //                 placeholder={t("notes")}
// //                 className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
// //               />
// //             </div>

// //             {/* extra participant names */}
// //             {form.participant_count > 1 && (
// //               <div className="space-y-3">
// //                 {form.additional_names.map((val, idx) => (
// //                   <input
// //                     key={idx}
// //                     value={val}
// //                     onChange={(e) => {
// //                       const copy = [...form.additional_names];
// //                       copy[idx] = e.target.value;
// //                       setForm((f) => ({ ...f, additional_names: copy }));
// //                     }}
// //                     className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none w-full"
// //                     placeholder={
// //                       language === "ja"
// //                         ? `追加参加者${idx + 1}の氏名`
// //                         : `Name of additional participant ${idx + 1}`
// //                     }
// //                     required
// //                   />
// //                 ))}
// //               </div>
// //             )}

// //             <label className="flex items-center gap-2 text-sm">
// //               <input
// //                 name="consent_given"
// //                 type="checkbox"
// //                 checked={form.consent_given}
// //                 onChange={onChange}
// //               />
// //               {t("declaration")}

// //             </label>
// //             <div className="flex justify-end">
// //               <button
// //                 disabled={submitting}
// //                 className="btn-brand disabled:opacity-50">
// //                 {submitting ? t("submitting") : t("submit")}
// //               </button>
// //             </div>
// //           </div>
// //         </form>
// //       </div>
// //     </section>
// //   );
// // }

// import React, { useEffect, useMemo, useState } from "react";
// import { createRegistration, getEvents } from "../lib/api";
// import { useLang } from "./LanguageProvider";
// import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

// export default function RegistrationForm() {
//   // --- confetti helper (unchanged) ---
//   function makeConfetti() {
//     const container = document.createElement("div");
//     container.style.position = "fixed";
//     container.style.inset = "0";
//     container.style.pointerEvents = "none";
//     container.style.zIndex = "9999";
//     for (let i = 0; i < 80; i++) {
//       const s = document.createElement("span");
//       const size = 6 + Math.random() * 8;
//       s.style.position = "absolute";
//       s.style.left = Math.random() * 100 + "%";
//       s.style.top = "-10px";
//       s.style.width = size + "px";
//       s.style.height = size + "px";
//       s.style.background = ["#4285F4", "#34A853", "#FBBC05", "#EA4335"][i % 4];
//       s.style.opacity = 0.9;
//       s.style.borderRadius = "2px";
//       s.style.transform = "rotate(" + Math.random() * 360 + "deg)";
//       const dur = 2000 + Math.random() * 2000;
//       s.animate(
//         [
//           { transform: s.style.transform + " translateY(0)", opacity: 1 },
//           { transform: s.style.transform + " translateY(110vh)", opacity: 0.9 },
//         ],
//         { duration: dur, easing: "cubic-bezier(.2,.7,.3,1)", delay: Math.random() * 600 }
//       );
//       container.appendChild(s);
//       setTimeout(() => s.remove(), dur + 800);
//     }
//     document.body.appendChild(container);
//     setTimeout(() => container.remove(), 4200);
//   }

//   const { t, language } = useLang();

//   const [events, setEvents] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     event_id: "",
//     preferred_date: "",
//     participant_count: "",      // start blank for better UX on mobile
//     notes: "",
//     additional_names: [],
//     consent_given: true,
//     trap: "",
//   });

//   const MAX_PARTICIPANTS = 6;
//   const [participantError, setParticipantError] = useState("");
//   const [phoneError, setPhoneError] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [ok, setOk] = useState(false);
//   const [error, setError] = useState(null);

//   // --- Load events ---
//   useEffect(() => {
//     (async () => {
//       try {
//         const data = await getEvents();
//         setEvents(Array.isArray(data) ? data : []);
//       } catch (e) {
//         console.error(e);
//       }
//     })();
//   }, []);

//   // Preselect event from QR (?event=...)
//   useEffect(() => {
//     if (window.__preselectEvent) {
//       setForm((f) => ({ ...f, event_id: window.__preselectEvent }));
//     }
//   }, []);

//   const selected = useMemo(
//     () => events.find((e) => e.id === form.event_id),
//     [events, form.event_id]
//   );

//   // Build slot options; show remaining slots; format date per language
//   const slotOptions = useMemo(() => {
//     const locale = language === "ja" ? "ja-JP" : "en-US";
//     const fmt = (dStr) => {
//       const d = new Date(dStr);
//       if (isNaN(d)) return dStr;
//       return d.toLocaleDateString(locale, language === "ja"
//         ? { year: "numeric", month: "short", day: "numeric" }
//         : { month: "short", day: "numeric", year: "numeric" }
//       );
//     };
//     return (selected?.available_slots || []).map((s) => {
//       const value = `${s.date}||${s.time || ""}`;
//       const dateTxt = fmt(s.date);
//       const timeTxt = s.time ? ` • ${s.time}` : "";
//       const left = Number(s.remaining_slots) || 0;
//       return {
//         value,
//         label: `${dateTxt}${timeTxt} (${left} ${t("slots_left")})`,
//       };
//     });
//   }, [selected, language, t]);

//   // Auto-select first slot when event picked and no date yet
//   useEffect(() => {
//     if (selected && !form.preferred_date && slotOptions.length > 0) {
//       setForm((f) => ({ ...f, preferred_date: slotOptions[0].value }));
//     }
//   }, [selected, slotOptions, form.preferred_date]);

//   // Listen for preselect from event card (registration:preselect)
//   useEffect(() => {
//     const handler = (e) => {
//       const id = e?.detail?.eventId;
//       if (!id) return;
//       setForm((f) => ({ ...f, event_id: id, preferred_date: "" }));

//       const ev = events.find((x) => x.id === id);
//       if (ev && Array.isArray(ev.available_slots) && ev.available_slots.length > 0) {
//         const s0 = ev.available_slots[0];
//         const preferred = [s0.date, s0.time].filter(Boolean).join("||");
//         setForm((f) => ({ ...f, preferred_date: preferred }));
//       }

//       document.querySelector("#registration")?.scrollIntoView({ behavior: "smooth" });
//     };
//     window.addEventListener("registration:preselect", handler);
//     return () => window.removeEventListener("registration:preselect", handler);
//   }, [events]);

//   const onChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
//     if (name === "event_id") setForm((f) => ({ ...f, preferred_date: "" }));
//   };

//   // --- Submit handler ---
//   async function submit(e) {
//     e.preventDefault();
//     setError(null);

//     // phone required + valid
//     if (!form.phone || !isValidPhoneNumber(form.phone)) {
//       setPhoneError(language === "ja" ? "有効な電話番号を入力してください。" : "Please enter a valid phone number.");
//       return;
//     } else {
//       setPhoneError("");
//     }

//     // normalize participants
//     let n = parseInt(form.participant_count || "0", 10);
//     if (!n || isNaN(n)) n = 1;
//     if (n < 1) n = 1;
//     if (n > MAX_PARTICIPANTS) {
//       setParticipantError(
//         language === "ja"
//           ? `一度に登録できるのは最大 ${MAX_PARTICIPANTS} 名です。`
//           : `Maximum ${MAX_PARTICIPANTS} participants per registration.`
//       );
//       return;
//     }
//     setParticipantError("");

//     // build extra names array
//     const additional = Array.from(
//       { length: Math.max(0, n - 1) },
//       (_, i) => (form.additional_names?.[i] || "").trim()
//     ).filter(Boolean);

//     const payload = {
//       ...form,
//       participant_count: n,       // send as number
//       additional_names: additional,
//     };

//     setSubmitting(true);
//     try {
//       const res = await createRegistration(payload);
//       if (!res || res.ok !== true) {
//         throw new Error("Registration failed");
//       }

//       // success
//       makeConfetti();
//       setOk(true);
//       // tell events to refresh (so remaining appears up to date where shown)
//       window.dispatchEvent(new Event("events:refresh"));

//       // optional reset (we keep ok screen)
//       // setForm({ ...form, name:"", email:"", phone:"", notes:"", participant_count:"", additional_names:[] })
//     } catch (err) {
//       console.error(err);
//       setError(language === "ja" ? "送信に失敗しました。もう一度お試しください。" : "Submission failed. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   // --- Thank-you view ---
//   if (ok) {
//     return (
//       <section className="py-20" id="registration">
//         <div className="max-w-3xl mx-auto px-4">
//           <div className="card p-10 text-center shadow-glow bg-gradient-to-br from-zoho-blue/10 to-zoho-green/10">
//             <h3 className="text-3xl font-semibold mb-2">{t("thanks_title")}</h3>
//             <p className="text-gray-600">{t("thanks_desc")}</p>
//             <div className="mt-6">
//               <a
//                 href="https://maps.app.goo.gl/bQBev61zubYmjPSN9"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center px-5 py-3 rounded-xl bg-blue-600 text-white hover:brightness-110"
//               >
//                 {language === "ja" ? "会場の地図を見る" : "View Event Location"}
//               </a>
//             </div>
//             <div className="mt-4">
//               <a
//                 href="#events"
//                 className="inline-flex items-center px-4 py-2 rounded-lg border hover:bg-gray-50"
//               >
//                 {t("back_events")}
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   // --- Form ---
//   return (
//     <section className="section py-20" id="registration">
//       <div className="max-w-3xl mx-auto px-4">
//         <div className="text-center mb-8">
//           <h2 className="text-4xl font-extrabold">{t("reg_title")}</h2>
//           <p className="text-gray-600 mt-2">{t("reg_desc")}</p>
//         </div>

//         {error && <p className="text-red-600 mb-3">{error}</p>}

//         <form onSubmit={submit} className="card shadow-glow overflow-hidden">
//           <div className="bg-gradient-to-r from-zoho-blue to-zoho-green text-white px-6 py-4 text-lg font-semibold">
//             {t("reg_heading")}
//           </div>

//           <div className="p-6 space-y-4">
//             {/* Row 1: Name + Phone */}
//             <div className="grid md:grid-cols-2 gap-4">
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={onChange}
//                 placeholder={t("name")}
//                 className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
//                 required
//               />

//               <div>
//                 <PhoneInput
//                   international
//                   defaultCountry="JP"
//                   value={form.phone}
//                   onChange={(val) => {
//                     setForm((f) => ({ ...f, phone: val || "" }));
//                     setPhoneError("");
//                   }}
//                   className="w-full"
//                   numberInputProps={{
//                     className:
//                       "border rounded-xl px-3 py-3 focus:ring-2 outline-none w-full " +
//                       (phoneError ? "border-red-500 focus:ring-red-400" : "focus:ring-zoho-blue"),
//                     placeholder: language === "ja" ? "電話番号" : "Phone number",
//                   }}
//                   countrySelectProps={{ className: "rounded-l-xl" }}
//                 />
//                 {phoneError && <div className="text-red-600 text-sm mt-1">{phoneError}</div>}
//               </div>
//             </div>

//             {/* Row 2: Email */}
//             <div>
//               <input
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={onChange}
//                 placeholder={t("email")}
//                 className="w-full border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
//                 required
//               />
//             </div>

//             {/* Row 3: Event + Date */}
//             <div className="grid md:grid-cols-2 gap-4">
//               <select
//                 name="event_id"
//                 value={form.event_id}
//                 onChange={onChange}
//                 className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
//                 required
//               >
//                 <option value="">{t("select_event")}</option>
//                 {events.map((ev) => (
//                   <option key={ev.id} value={ev.id}>
//                     {language === "ja" ? (ev.title_ja || ev.title_en) : (ev.title_en || ev.title_ja)}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 name="preferred_date"
//                 value={form.preferred_date}
//                 onChange={onChange}
//                 className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
//                 required
//               >
//                 <option value="">{t("select_date")}</option>
//                 {slotOptions.map((opt) => (
//                   <option key={opt.value} value={opt.value}>
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Row 4: Participants + Notes */}
//             <div className="grid md:grid-cols-2 gap-4">
//               {/* Participants (mobile-friendly free input) */}
//               <div>
//                 <input
//                   name="participant_count"
//                   type="tel"
//                   inputMode="numeric"
//                   pattern="[0-9]*"
//                   value={String(form.participant_count ?? "")}
//                   onChange={(e) => {
//                     const raw = e.target.value;

//                     // allow empty while typing
//                     if (raw === "") {
//                       setForm((f) => ({ ...f, participant_count: "" }));
//                       setParticipantError("");
//                       return;
//                     }

//                     if (!/^\d+$/.test(raw)) return; // digits only

//                     const n = parseInt(raw, 10);

//                     if (n > MAX_PARTICIPANTS) {
//                       setParticipantError(
//                         language === "ja"
//                           ? `一度に登録できるのは最大 ${MAX_PARTICIPANTS} 名です。`
//                           : `Maximum ${MAX_PARTICIPANTS} participants per registration.`
//                       );
//                     } else if (n < 1) {
//                       setParticipantError(
//                         language === "ja" ? "1 以上を入力してください。" : "Please enter at least 1."
//                       );
//                     } else {
//                       setParticipantError("");
//                     }

//                     setForm((f) => ({ ...f, participant_count: raw }));

//                     if (n >= 1 && n <= MAX_PARTICIPANTS) {
//                       setForm((f) => ({
//                         ...f,
//                         participant_count: raw,
//                         additional_names: Array.from(
//                           { length: Math.max(0, n - 1) },
//                           (_, i) => f.additional_names?.[i] || ""
//                         ),
//                       }));
//                     }
//                   }}
//                   onBlur={() => {
//                     let n = parseInt(form.participant_count || "0", 10);
//                     if (!n || isNaN(n)) n = 1;
//                     if (n < 1) n = 1;
//                     if (n > MAX_PARTICIPANTS) n = MAX_PARTICIPANTS;

//                     setForm((f) => ({
//                       ...f,
//                       participant_count: String(n),
//                       additional_names: Array.from(
//                         { length: Math.max(0, n - 1) },
//                         (_, i) => f.additional_names?.[i] || ""
//                       ),
//                     }));
//                     setParticipantError("");
//                   }}
//                   placeholder={language === "ja" ? "参加人数" : "No. of participants"}
//                   className={[
//                     "w-full border rounded-xl px-3 py-3 outline-none focus:ring-2",
//                     participantError ? "border-red-500 focus:ring-red-400" : "focus:ring-zoho-blue",
//                   ].join(" ")}
//                 />
//                 {participantError && <div className="mt-1 text-sm text-red-600">{participantError}</div>}
//               </div>

//               <input
//                 name="notes"
//                 value={form.notes}
//                 onChange={onChange}
//                 placeholder={t("notes")}
//                 className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none"
//               />
//             </div>

//             {/* Extra participant names */}
//             {Number(form.participant_count) > 1 && (
//               <div className="space-y-3">
//                 {form.additional_names.map((val, idx) => (
//                   <input
//                     key={idx}
//                     value={val}
//                     onChange={(e) => {
//                       const copy = [...form.additional_names];
//                       copy[idx] = e.target.value;
//                       setForm((f) => ({ ...f, additional_names: copy }));
//                     }}
//                     className="border rounded-xl px-3 py-3 focus:ring-2 focus:ring-zoho-blue outline-none w-full"
//                     placeholder={
//                       language === "ja"
//                         ? `追加参加者${idx + 1}の氏名`
//                         : `Name of additional participant ${idx + 1}`
//                     }
//                     required
//                   />
//                 ))}
//               </div>
//             )}

//             {/* Consent */}
//             <label className="flex items-center gap-2 text-sm">
//               <input
//                 name="consent_given"
//                 type="checkbox"
//                 checked={form.consent_given}
//                 onChange={onChange}
//               />
//               {t("declaration")}
//             </label>

//             {/* Submit */}
//             <div className="flex justify-end">
//               <button type="submit" disabled={submitting} className="btn-brand disabled:opacity-50">
//                 {submitting ? t("submitting") : t("submit")}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import { createRegistration, getEvents } from "../lib/api";
import { useLang } from "./LanguageProvider";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

export default function RegistrationForm() {
  // ------- confetti helper -------
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
    preferred_date: "",
    participant_count: "", // blank to start (better UX on mobile)
    notes: "",
    additional_names: [],
    consent_given: true,
    trap: "",
  });

  const MAX_PARTICIPANTS = 6;
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);

  // all field errors here
  const [errors, setErrors] = useState({});
  const setFieldError = (field, msg) =>
    setErrors((e) => ({ ...e, [field]: msg || "" }));

  // ------- load events -------
  useEffect(() => {
    (async () => {
      try {
        const data = await getEvents();
        setEvents(Array.isArray(data) ? data : []);
      } catch {}
    })();
  }, []);

  // Preselect event from QR (?event=...)
  useEffect(() => {
    if (window.__preselectEvent) {
      setForm((f) => ({ ...f, event_id: window.__preselectEvent }));
    }
  }, []);

  const selected = useMemo(
    () => events.find((e) => e.id === form.event_id),
    [events, form.event_id]
  );

  // Date options: language-specific date + remaining slots text
  const slotOptions = useMemo(() => {
    const locale = language === "ja" ? "ja-JP" : "en-US";
    const fmt = (dStr) => {
      const d = new Date(dStr);
      if (isNaN(d)) return dStr;
      return d.toLocaleDateString(
        locale,
        language === "ja"
          ? { year: "numeric", month: "short", day: "numeric" }
          : { month: "short", day: "numeric", year: "numeric" }
      );
    };
    return (selected?.available_slots || []).map((s) => {
      const value = `${s.date}||${s.time || ""}`;
      const dateTxt = fmt(s.date);
      const timeTxt = s.time ? ` • ${s.time}` : "";
      const left = Number(s.remaining_slots) || 0;
      const slotsWord = language === "ja" ? "枠" : "slots";
      return { value, label: `${dateTxt}${timeTxt} (${left} ${slotsWord})` };
    });
  }, [selected, language]);

  // Auto-select first slot when event changes
  useEffect(() => {
    if (selected && !form.preferred_date && slotOptions.length > 0) {
      setForm((f) => ({ ...f, preferred_date: slotOptions[0].value }));
    }
  }, [selected, slotOptions, form.preferred_date]);

  // ----- helpers -----
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setFieldError(name, "");
    if (name === "event_id") {
      setForm((f) => ({ ...f, preferred_date: "" }));
    }
  };

  const inputClass = (field) =>
    [
      "border rounded-xl px-3 py-3 outline-none focus:ring-2 w-full",
      errors[field]
        ? "border-red-500 focus:ring-red-400"
        : "focus:ring-zoho-blue",
    ].join(" ");

  // ----- submit -----
  async function submit(e) {
    e.preventDefault();
    setErrors({});

    // Validate fields (custom messages EN/JA)
    let hasError = false;
    const msg = {
      name:
        language === "ja"
          ? "お名前を入力してください。"
          : "Please enter your name.",
      email:
        language === "ja"
          ? "有効なメールアドレスを入力してください。"
          : "Please enter a valid email.",
      phone:
        language === "ja"
          ? "有効な電話番号を入力してください。"
          : "Please enter a valid phone number.",
      event_id:
        language === "ja"
          ? "イベントを選択してください。"
          : "Please select an event.",
      preferred_date:
        language === "ja"
          ? "希望日を選択してください。"
          : "Please select a preferred date.",
      participantsMin:
        language === "ja"
          ? "参加人数は1名以上を入力してください。"
          : "Please enter at least 1 participant.",
      participantsMax:
        language === "ja"
          ? `一度に登録できるのは最大 ${MAX_PARTICIPANTS} 名です。`
          : `Maximum ${MAX_PARTICIPANTS} participants per registration.`,
      addName: (i) =>
        language === "ja"
          ? `追加参加者${i + 1}の氏名を入力してください。`
          : `Please enter the name of additional participant ${i + 1}.`,
    };

    if (!form.name.trim()) {
      setFieldError("name", msg.name);
      hasError = true;
    }

    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setFieldError("email", msg.email);
      hasError = true;
    }

    if (!form.phone || !isValidPhoneNumber(form.phone)) {
      setFieldError("phone", msg.phone);
      hasError = true;
    }

    if (!form.event_id) {
      setFieldError("event_id", msg.event_id);
      hasError = true;
    }

    if (!form.preferred_date) {
      setFieldError("preferred_date", msg.preferred_date);
      hasError = true;
    }

    let n = parseInt(form.participant_count || "0", 10);
    if (!n || isNaN(n) || n < 1) {
      setFieldError("participant_count", msg.participantsMin);
      hasError = true;
      n = 1;
    } else if (n > MAX_PARTICIPANTS) {
      setFieldError("participant_count", msg.participantsMax);
      hasError = true;
      n = MAX_PARTICIPANTS;
    }

    // validate additional names when n > 1
    if (n > 1) {
      for (let i = 0; i < n - 1; i++) {
        const v = (form.additional_names?.[i] || "").trim();
        if (!v) {
          setFieldError(`additional_${i}`, msg.addName(i));
          hasError = true;
        }
      }
    }

    if (hasError) return;

    // build additional_names array (trim + filter blanks)
    const additional = Array.from({ length: Math.max(0, n - 1) }, (_, i) =>
      (form.additional_names?.[i] || "").trim()
    ).filter(Boolean);

    const payload = {
      ...form,
      participant_count: n, // send as number
      additional_names: additional,
    };

    setSubmitting(true);
    try {
      const res = await createRegistration(payload);
      if (!res || res.ok !== true) throw new Error("Registration failed");

      makeConfetti();
      setOk(true);
      window.dispatchEvent(new Event("events:refresh"));
    } catch (err) {
      // top-level form error: show generic banner or inline
      setFieldError(
        "form",
        language === "ja"
          ? "送信に失敗しました。もう一度お試しください。"
          : "Submission failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ------- thank-you screen -------
  if (ok) {
    return (
      <section className="py-20" id="registration">
        <div className="max-w-3xl mx-auto px-4">
          <div className="card p-10 text-center shadow-glow bg-gradient-to-br from-zoho-blue/10 to-zoho-green/10">
            <h3 className="text-3xl font-semibold mb-2">{t("thanks_title")}</h3>
            <p className="text-gray-600">{t("thanks_desc")}</p>
            <div className="mt-6">
              <a
                href="https://maps.app.goo.gl/bQBev61zubYmjPSN9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-3 rounded-xl bg-blue-600 text-white hover:brightness-110"
              >
                {language === "ja" ? "会場の地図を見る" : "View Event Location"}
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

  // ------- form -------
  return (
    <section className="section py-20" id="registration">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold">{t("reg_title")}</h2>
          <p className="text-gray-600 mt-2">{t("reg_desc")}</p>
        </div>

        {errors.form && <p className="text-red-600 mb-3">{errors.form}</p>}

        <form onSubmit={submit} className="card shadow-glow overflow-hidden">
          <div className="bg-gradient-to-r from-zoho-blue to-zoho-green text-white px-6 py-4 text-lg font-semibold">
            {t("reg_heading")}
          </div>

          <div className="p-6 space-y-4">
            {/* Row 1: Name + Phone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder={t("name")}
                  className={inputClass("name")}
                />
                {errors.name && (
                  <div className="text-red-600 text-sm mt-1">{errors.name}</div>
                )}
              </div>

              {/* <div>
                <PhoneInput
                  international
                  defaultCountry="JP"
                  value={form.phone}
                  onChange={(val) => {
                    setForm((f) => ({ ...f, phone: val || "" }));
                    setFieldError("phone", "");
                  }}
                  className="w-full"
                  numberInputProps={{
                    className: inputClass("phone"),
                    // clear " +81 " looking placeholder → show friendly example per language
                    placeholder:
                      language === "ja"
                        ? "例: 090 1234 5678"
                        : "e.g. (201) 555-0123",
                  }}
                  countrySelectProps={{ className: "rounded-l-xl" }}
                />
                {errors.phone && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.phone}
                  </div>
                )}
              </div> */}
              <div>
  <PhoneInput
    /* 👇 force national format (no +81 in the box) */
    country="JP"                       /* lock to JP; use defaultCountry if you want it changeable */
    defaultCountry="JP"
    /* IMPORTANT: remove `international` prop */
    displayInitialValueAsLocalNumber   /* show local format for any initial value */
    addInternationalOption={false}     /* hide the “International” option in the dropdown */

    /* keep your state as is */
    value={form.phone}
    onChange={(val) => {
      setForm((f) => ({ ...f, phone: val || "" }));
      setFieldError?.("phone", "");    // if you're using field-level errors
    }}

    className="w-full"
    numberInputProps={{
      /* ✅ clear, friendly placeholder inside the box */
      placeholder: language === "ja" ? "電話番号" : "Phone number",
      className: inputClass ? inputClass("phone") : "border rounded-xl px-3 py-3 w-full focus:ring-2 focus:ring-zoho-blue outline-none",
    }}
    countrySelectProps={{ className: "rounded-l-xl" }}
  />
  {errors?.phone && <div className="text-red-600 text-sm mt-1">{errors.phone}</div>}
</div>

            </div>

            {/* Row 2: Email */}
            <div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder={t("email")}
                className={inputClass("email")}
              />
              {errors.email && (
                <div className="text-red-600 text-sm mt-1">{errors.email}</div>
              )}
            </div>

            {/* Row 3: Event + Date */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <select
                  name="event_id"
                  value={form.event_id}
                  onChange={onChange}
                  className={inputClass("event_id")}
                >
                  <option value="">{t("select_event")}</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {language === "ja"
                        ? ev.title_ja || ev.title_en
                        : ev.title_en || ev.title_ja}
                    </option>
                  ))}
                </select>
                {errors.event_id && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.event_id}
                  </div>
                )}
              </div>

              <div>
                <select
                  name="preferred_date"
                  value={form.preferred_date}
                  onChange={onChange}
                  className={inputClass("preferred_date")}
                >
                  <option value="">{t("select_date")}</option>
                  {slotOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.preferred_date && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.preferred_date}
                  </div>
                )}
              </div>
            </div>

            {/* Row 4: Participants + Notes */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  name="participant_count"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={String(form.participant_count ?? "")}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      setForm((f) => ({ ...f, participant_count: "" }));
                      setFieldError("participant_count", "");
                      return;
                    }
                    if (!/^\d+$/.test(raw)) return;
                    const n = parseInt(raw, 10);
                    // resize additional names live if within bounds
                    setForm((f) => ({
                      ...f,
                      participant_count: raw,
                      additional_names:
                        n >= 1 && n <= MAX_PARTICIPANTS
                          ? Array.from(
                              { length: Math.max(0, n - 1) },
                              (_, i) => f.additional_names?.[i] || ""
                            )
                          : f.additional_names,
                    }));
                    setFieldError("participant_count", "");
                  }}
                  onBlur={() => {
                    let n = parseInt(form.participant_count || "0", 10);
                    if (!n || isNaN(n)) n = 1;
                    if (n < 1) n = 1;
                    if (n > MAX_PARTICIPANTS) n = MAX_PARTICIPANTS;
                    setForm((f) => ({
                      ...f,
                      participant_count: String(n),
                      additional_names: Array.from(
                        { length: Math.max(0, n - 1) },
                        (_, i) => f.additional_names?.[i] || ""
                      ),
                    }));
                  }}
                  placeholder={
                    language === "ja" ? "参加人数" : "No. of participants"
                  }
                  className={inputClass("participant_count")}
                />
                {errors.participant_count && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.participant_count}
                  </div>
                )}
              </div>

              <input
                name="notes"
                value={form.notes}
                onChange={onChange}
                placeholder={t("notes")}
                className={inputClass("notes")}
              />
            </div>

            {/* Extra participant names */}
            {Number(form.participant_count) > 1 && (
              <div className="space-y-3">
                {form.additional_names.map((val, idx) => (
                  <div key={idx}>
                    <input
                      value={val}
                      onChange={(e) => {
                        const copy = [...form.additional_names];
                        copy[idx] = e.target.value;
                        setForm((f) => ({ ...f, additional_names: copy }));
                        setFieldError(`additional_${idx}`, "");
                      }}
                      className={inputClass(`additional_${idx}`)}
                      placeholder={
                        language === "ja"
                          ? `追加参加者${idx + 1}の氏名`
                          : `Name of additional participant ${idx + 1}`
                      }
                    />
                    {errors[`additional_${idx}`] && (
                      <div className="text-red-600 text-sm mt-1">
                        {errors[`additional_${idx}`]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Consent */}
            <label className="flex items-center gap-2 text-sm">
              <input
                name="consent_given"
                type="checkbox"
                checked={form.consent_given}
                onChange={onChange}
              />
              {t("declaration")}
            </label>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
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
