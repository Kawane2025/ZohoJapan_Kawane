import React, { createContext, useContext, useMemo, useState } from "react";
const content = {
  hero_title: { ja: "ゾーホージャパン川根本町オフィス", en: "Zoho Japan Kawane Office" },
  hero_desc: {
    ja: "コミュニティイベント、ワークショップ、地域連携のご案内。",
    en: "Join our community events, workshops, and local initiatives.",
  },
  hero_cta: { ja: "登録へ", en: "Go to Registration" },

  events_title: { ja: "イベント", en: "Events" },
  events_loading: { ja: "読み込み中", en: "Loading..." },
  current_label: { ja: "現在のイベント", en: "Current Event" },
  upcoming_label: { ja: "今後のイベント", en: "Upcoming Event" },
  register: { ja: "登録", en: "Register" },
  total_slots: { ja: "合計枠", en: "total slots" },

  gallery_title: { ja: "フォトギャラリー", en: "Photo Gallery" },

  reg_title: { ja: "参加登録", en: "Program Registration" },
  reg_desc: {
    ja: "下記フォームにご入力ください。",
    en: "Fill out the form to secure your spot.",
  },
  reg_heading:{ ja: "登録フォーム", en: "Registration Form" },
  name: { ja: "お名前", en: "Name" },
  email: { ja: "メールアドレス", en: "Email Address" },
    number: { ja: "電話番号", en: "Phone number" },
  select_event: { ja: "イベントを選択", en: "Select an event" },
  select_date: { ja: "希望日を選択", en: "Select preferred date" },
  participants: { ja: "参加人数", en: "Participants" },
  notes: { ja: "備考", en: "Notes" },
  submitting: { ja: "送信中…", en: "Submitting…" },
  submit: { ja: "送信", en: "Submit" },
 declaration : {ja: "個人情報の取り扱いに同意します。", en: "I consent to handling of my personal information." },
  thanks_title: {
    ja: "お申込みありがとうございました！",
    en: "Thank you for your registration!",
  },
  thanks_desc: {
    ja: "担当者よりご連絡いたします。",
    en: "We will contact you shortly.",
  },
  view_location: { ja: "会場を見る", en: "View Event Location" },
  back_events: { ja: "イベント一覧へ", en: "Back to Events" },

  nav_events: { ja: "イベント", en: "Events" },
  nav_registration: { ja: "登録", en: "Registration" },
  nav_gallery: { ja: "ギャラリー", en: "Photo Gallery" },

  footer_more_kawane: { ja: "川根の活動を見る", en: "View Kawane Activities" },
  footer_more_zoho: {
    ja: "Zohoについてもっと知る",
    en: "Learn More about Zoho",
  },
};
const LanguageContext = createContext();
export const useLang = () => useContext(LanguageContext);
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("ja");
  const toggleLanguage = () => setLanguage((l) => (l === "ja" ? "en" : "ja"));
  const t = useMemo(
    () => (key) => {
      const node = content[key];
      return node?.[language] ?? node?.en ?? key;
    },
    [language]
  );
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
