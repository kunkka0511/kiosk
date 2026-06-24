"use client";

import { useSyncExternalStore } from "react";
import { QRCodeSVG } from "qrcode.react";
import { GREEN, MUSTARD, CHARCOAL, FONT_HEAD, FONT_BODY } from "./tokens";

const fallbackPath = "/m/mandala?source=kiosk_qr&screen=sales_managers";
const subscribe = () => () => {};

export default function MobileQrCard() {
  const origin = useSyncExternalStore(
    subscribe,
    () => window.location.origin,
    () => "",
  );
  const configured = process.env.NEXT_PUBLIC_MOBILE_PRESENTATION_URL?.trim();
  const url = configured || (origin ? `${origin}${fallbackPath}` : fallbackPath);

  return (
    <article data-qr-url={url} aria-label="Mandala Garden mobile танилцуулгын QR код"
      style={{ minWidth: 0, padding: "clamp(14px,1.25vw,22px)", borderRadius: 20,
      border: `2px solid ${GREEN}33`, background: "linear-gradient(155deg,#fff,#f1f8ef)",
      boxShadow: "0 14px 44px rgba(0,0,0,0.09)", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8 }}>
      <div style={{ padding: 7, borderRadius: 13, background: "#fff", boxShadow: "0 8px 24px rgba(31,70,41,.12)" }}>
        <QRCodeSVG value={url} size={150} level="M" marginSize={2} fgColor="#173b2b" bgColor="#ffffff"
          style={{ display: "block", width: "clamp(112px,7.8vw,150px)", height: "auto" }} />
      </div>
      <span style={{ color: MUSTARD, fontSize: "clamp(17px,1.25vw,23px)" }} aria-hidden="true">▣ 📱</span>
      <h3 style={{ margin: 0, color: CHARCOAL, fontFamily: FONT_HEAD, fontSize: "clamp(15px,1.05vw,20px)", lineHeight: 1.08 }}>
        Утсаараа танилцуулга авах
      </h3>
      <p style={{ margin: 0, color: "#69736c", fontFamily: FONT_BODY, fontSize: "clamp(10px,.72vw,13px)", lineHeight: 1.3 }}>
        QR код уншуулж төслийн мэдээлэл болон үнэ авах хүсэлтээ илгээнэ үү.
      </p>
      <small style={{ color: GREEN, fontWeight: 700, fontSize: "clamp(9px,.62vw,11px)" }}>Mandala Garden mobile танилцуулга</small>
      <a href={url} target="_blank" rel="noreferrer"
        style={{ width: "100%", minHeight: 34, marginTop: 2, padding: "8px 10px", borderRadius: 11,
          display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
          background: GREEN, color: "#fff", fontFamily: FONT_BODY, fontWeight: 750,
          fontSize: "clamp(10px,.72vw,13px)", boxShadow: "0 7px 18px rgba(66,149,71,.22)" }}>
        Танилцуулга шууд үзэх ↗
      </a>
    </article>
  );
}
