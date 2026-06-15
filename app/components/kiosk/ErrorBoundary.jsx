"use client";
// ============================================================================
//  ERROR BOUNDARY — алдаа гарвал kiosk гацахгүй, 8с дараа автоматаар сэргэнэ.
//  Танхимд хяналтгүй ажилладаг тул "цагаан дэлгэц"-ийн оронд брэндийн
//  reload дэлгэц харуулж, өөрөө reload хийнэ.
// ============================================================================
import { Component } from "react";
import { GREEN, OFFWHITE, CHARCOAL, FONT_HEAD } from "./tokens";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.t = null;
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) {
    if (typeof console !== "undefined") console.error("Kiosk error:", error);
    this.t = setTimeout(() => {
      if (typeof window !== "undefined") window.location.reload();
    }, 8000);
  }
  componentWillUnmount() { clearTimeout(this.t); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ position: "fixed", inset: 0, background: OFFWHITE, color: CHARCOAL,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 22, fontFamily: FONT_HEAD }}>
          <img src="/assets/logo/mandala-garden-logo.png" alt="Mandala Garden" style={{ width: 170, height: "auto" }} />
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "0.02em" }}>Түр хүлээнэ үү…</div>
          <div style={{ width: 240, height: 5, borderRadius: 5, overflow: "hidden", background: "rgba(0,0,0,0.08)" }}>
            <div style={{ height: "100%", width: "100%", background: GREEN, transformOrigin: "left",
              animation: "kioskReload 8s linear forwards" }} />
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
