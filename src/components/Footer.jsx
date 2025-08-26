import React from "react";
import images from "../config/images";
import { COMPANY } from "../config/company";

export default function Footer() {
  // Build an embeddable URL from the address:
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    COMPANY.mapsQuery || COMPANY.addressLines.join(" ")
  )}&output=embed`;

  return (
    <footer className="mt-10 bg-zoho-navy text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6 items-start">
        <div>
          <div className="flex items-start gap-3 mb-4">
            <img src={images.logo} alt="Zoho" className="h-8 w-auto mt-1" />
            <div>
              <div className="text-xl font-semibold">
                ゾーホージャパン川根本
              </div>
              <div className="text-sm opacity-80">
                地域と学びをつなぐコミュニティプログラム
              </div>
            </div>
          </div>
          <div className="space-y-1 text-base opacity-95">
            <div className="font-semibold">{COMPANY.name}</div>
            {COMPANY.addressLines.map((l, i) => (
              <div key={i}>{l}</div>
            ))}
            <div>
              Phone:{" "}
              <a className="underline" href={`tel:${COMPANY.phone}`}>
                {COMPANY.phone}
              </a>
            </div>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden shadow-glow border border-white/10">
          <iframe
            title="Map"
            src={mapSrc}
            className="w-full h-48 border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="">
        <div className="max-w-6xl mx-auto px-4 py-3 text-xs opacity-90 flex items-center justify-between">
          <span>Copyright© ZOHO Japan Corporation. All Rights Reserved.</span>
          <a
            href="https://www.zoho.co.jp/kawanehoncho/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            活動を見る
          </a>
        </div>
      </div>
    </footer>
  );
}
