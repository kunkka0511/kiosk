"use client";
// ============================================================================
//  WELCOME / IDLE SCREEN — kiosk эхлэх дэлгэц
//  • Tap эсвэл хэвтээ swipe хийхэд exit animation тоглож танилцуулга нээгдэнэ.
//  • Бүх хөдөлгөөн CSS keyframe (globals.css → .wlc-*). Энд зөвхөн зохион байгуулалт.
//  • onBegin() — exit animation дууссаны дараа дуудагдана (≈1с).
// ============================================================================
import { useEffect, useRef, useState } from "react";
import { A } from "./tokens";
import { tick } from "./feedback";

const COLORS = ["#FEB20A", "#009DDE", "#429547"];
const SPOTS = [
  { x: 17, y: 31, s: 18 }, { x: 32, y: 67, s: 13 }, { x: 11, y: 78, s: 14 }, { x: 10, y: 80, s: 9 },
  { x: 74, y: 62, s: 8 }, { x: 88, y: 81, s: 11 }, { x: 64, y: 84, s: 10 }, { x: 62, y: 82, s: 7 },
  { x: 94, y: 84, s: 20 }, { x: 48, y: 22, s: 7 }, { x: 83, y: 30, s: 9 }, { x: 24, y: 48, s: 6 },
];
const LEAF = "M100 6C150 70 150 210 100 274 50 210 50 70 100 6Z";

export default function Welcome({ onBegin, reduced }) {
  const [exiting, setExiting] = useState(false);
  const done = useRef(false);
  const start = useRef({ x: 0, y: 0, t: 0 });

  const begin = () => {
    if (done.current) return;
    done.current = true;
    tick(620, 0.06);
    setExiting(true);
    setTimeout(() => onBegin && onBegin(), reduced ? 0 : 1000);
  };

  useEffect(() => {
    const down = (e) => { start.current = { x: e.clientX, y: e.clientY, t: Date.now() }; };
    const up = (e) => {
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;
      const moved = Math.hypot(dx, dy);
      const dt = Date.now() - start.current.t;
      if ((moved < 14 && dt < 600) || Math.abs(dx) > 60) begin();
    };
    const key = (e) => { if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") begin(); };
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("keydown", key);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`wlc${exiting ? " exit" : ""}`}>
      {/* фон навч (lotus petal) */}
      <div className="wlc-petals">
        <svg className="wlc-petal tr1" viewBox="0 0 200 280"><path d={LEAF} /></svg>
        <svg className="wlc-petal tr2" viewBox="0 0 200 280" style={{ transform: "rotate(38deg)" }}><path d={LEAF} /></svg>
        <svg className="wlc-petal tr3" viewBox="0 0 200 280" style={{ transform: "rotate(-26deg)" }}><path d={LEAF} /></svg>
        <svg className="wlc-petal bl1" viewBox="0 0 200 280"><path d={LEAF} /></svg>
        <svg className="wlc-petal bl2" viewBox="0 0 200 280" style={{ transform: "rotate(42deg)" }}><path d={LEAF} /></svg>
        <svg className="wlc-petal bl3" viewBox="0 0 200 280" style={{ transform: "rotate(-32deg)" }}><path d={LEAF} /></svg>
      </div>

      {/* брэндийн өнгөт цэгүүд */}
      <div className="wlc-dots">
        {SPOTS.map((p, i) => (
          <span key={i} className="wlc-dot" style={{
            left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s,
            background: COLORS[i % COLORS.length],
            opacity: (0.55 + (i % 4) * 0.12).toFixed(2),
            animation: reduced ? "none" : `wlc-float ${5 + (i % 5)}s ease-in-out ${(i * 0.4).toFixed(1)}s infinite`,
          }} />
        ))}
      </div>

      {/* төв — лого + хүрэх товч */}
      <div className="wlc-center">
        <div className="wlc-logo-wrap">
          <img className="wlc-logo" src={A.logo} alt="Mandala Garden" />
        </div>

        <div className="wlc-touch">
          <span className="wlc-ring r1" />
          <span className="wlc-ring r2" />
          <span className="wlc-ring r3" />
          <div className="wlc-circle">
            <svg className="wlc-hand" viewBox="0 0 64 64" fill="none" stroke="currentColor"
              strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M26 30V14a5 5 0 0 1 10 0v18" />
              <path d="M36 26a4 4 0 0 1 8 0v8" />
              <path d="M44 28a4 4 0 0 1 8 0v12c0 9-6 16-16 16h-4c-6 0-9-2-12-7l-7-12a4 4 0 0 1 7-4l4 6" />
            </svg>
          </div>
        </div>

        <div className="wlc-label">Эхлэхийн тулд дэлгэцэнд хүрнэ үү</div>
      </div>

      {/* swipe hint */}
      <div className="wlc-swipe">
        <div className="wlc-chev"><span /><span /><span /></div>
        <div className="wlc-slabel">Шудран эхлүүлнэ үү</div>
        <div className="wlc-gline" />
      </div>
    </div>
  );
}
