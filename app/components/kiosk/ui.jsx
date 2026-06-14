"use client";
// ============================================================================
//  KIOSK ДАХИН АШИГЛАХ PRIMITIVE-УУД
//  Media (зураг/видео), LiveGradient, MandalaMotif, TriDots, CountUp,
//  Particles, Heading, SlidePad + useReducedMotion hook.
// ============================================================================
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { GREEN, BLUE, MUSTARD, OFFWHITE, CHARCOAL, FONT_HEAD, FONT_BRAND, FONT_BODY } from "./tokens";

// ── prefers-reduced-motion ──────────────────────────────────────────────────
export function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(mq.matches);
    const h = (e) => setR(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return r;
}

// ── Медиа: зураг ЭСВЭЛ видео. Ачаалахаас өмнө амьд gradient placeholder. ──────
export function Media({ src, alt = "", grad = ["#9aa3b0", "#5a6a7e"], fit = "cover", bg = OFFWHITE, reduced }) {
  const [loaded, setLoaded] = useState(false);
  const vidRef = useRef(null);
  const isVideo = /\.(mp4|webm)$/i.test(src);
  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    if (reduced) v.pause();
    else v.play?.().catch(() => {});
  }, [reduced, loaded]);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: bg }}>
      {!loaded && <LiveGradient colors={grad} reduced={reduced} />}
      {isVideo ? (
        <video ref={vidRef} src={src} muted loop playsInline preload="metadata" autoPlay={!reduced}
          onLoadedData={() => setLoaded(true)}
          style={{ width: "100%", height: "100%", objectFit: fit, opacity: loaded ? 1 : 0, transition: "opacity 0.7s ease" }} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} onLoad={() => setLoaded(true)}
          style={{ width: "100%", height: "100%", objectFit: fit, opacity: loaded ? 1 : 0, transition: "opacity 0.7s ease" }} />
      )}
    </div>
  );
}

// ── Аажуухан шилжих gradient (placeholder / дэвсгэр) ─────────────────────────
export function LiveGradient({ colors, style, reduced }) {
  return (
    <motion.div
      style={{ position: "absolute", inset: 0, backgroundSize: "300% 300%",
        backgroundImage: `linear-gradient(135deg, ${colors.join(",")})`, ...style }}
      animate={reduced ? undefined : { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
  );
}

// ── Mandala motif — субтл, аажуухан эргэлдэх дугуй хээ ────────────────────────
export function MandalaMotif({ size = 620, color = GREEN, opacity = 0.06, reduced, style }) {
  const petals = Array.from({ length: 16 });
  return (
    <motion.svg width={size} height={size} viewBox="0 0 200 200"
      style={{ position: "absolute", opacity, pointerEvents: "none", ...style }}
      animate={reduced ? {} : { rotate: 360 }}
      transition={{ duration: 140, repeat: Infinity, ease: "linear" }}>
      <g fill="none" stroke={color} strokeWidth="0.7">
        <circle cx="100" cy="100" r="96" />
        <circle cx="100" cy="100" r="72" />
        <circle cx="100" cy="100" r="46" />
        <circle cx="100" cy="100" r="22" />
        {petals.map((_, i) => (
          <ellipse key={i} cx="100" cy="54" rx="11" ry="40"
            transform={`rotate(${(360 / petals.length) * i} 100 100)`} />
        ))}
      </g>
    </motion.svg>
  );
}

// ── "• • •" брэндийн гарын үсэг divider — 3 цэг тус бүр өөр брэнд өнгөтэй ──────
// (Forest Green · Sky Blue · Soft Mustard). Idle үед аажуухан анивчина.
export function TriDots({ center, reduced }) {
  const cols = [MUSTARD, BLUE, GREEN]; // Zoo шар · Water цэнхэр · Forest ногоон
  return (
    <div style={{ display: "flex", gap: 9, justifyContent: center ? "center" : "flex-start", margin: "0 0 18px" }}>
      {cols.map((c, i) => (
        <motion.span key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }}
          animate={reduced ? {} : { opacity: [0.45, 1, 0.45], scale: [1, 1.18, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }} />
      ))}
    </div>
  );
}

// ── Count-up тоо (slide идэвхжихэд эхэлнэ) ────────────────────────────────────
export function CountUp({ target, suffix = "", reduced }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (reduced) { setVal(target); return; }
    const t0 = performance.now(), dur = 1500;
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced]);
  return <span>{val.toLocaleString()}{suffix}</span>;
}

// ── Хөвөх particle (оройн орчин) ──────────────────────────────────────────────
export function Particles({ count = 18, color = "rgba(255,255,255,0.5)", reduced }) {
  const [dots, setDots] = useState([]);
  useEffect(() => {
    setDots(Array.from({ length: count }, () => ({
      x: Math.random() * 100, y: Math.random() * 100,
      s: 2 + Math.random() * 4, d: 6 + Math.random() * 10, delay: Math.random() * 6,
    })));
  }, [count]);
  if (reduced) return null;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {dots.map((p, i) => (
        <motion.div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.s, height: p.s, borderRadius: "50%", background: color }}
          animate={{ y: [0, -40, 0], opacity: [0, 1, 0] }}
          transition={{ duration: p.d, repeat: Infinity, delay: p.delay, ease: "easeInOut" }} />
      ))}
    </div>
  );
}

// ── Гарчиг — нэг slide-д ГАНЦ том гарчиг (текстийн шатлал) ─────────────────────
export function Heading({ children, kicker, kickerColor = GREEN, light, reduced }) {
  return (
    <div style={{ marginBottom: "min(3.5vh,34px)" }}>
      {kicker && (
        <>
          <TriDots reduced={reduced} />
          <p style={{ letterSpacing: "0.22em", fontSize: "clamp(13px,1vw,18px)", textTransform: "uppercase",
            color: kickerColor, margin: "0 0 12px", fontWeight: 700, fontFamily: FONT_BODY }}>{kicker}</p>
        </>
      )}
      <motion.h2 initial={{ opacity: 0, y: reduced ? 0 : 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontSize: "clamp(34px,3vw,52px)", fontWeight: 700, lineHeight: 1.08, margin: 0,
          letterSpacing: "-0.01em", color: light ? "#fff" : CHARCOAL, fontFamily: FONT_HEAD }}>
        {children}
      </motion.h2>
    </div>
  );
}

// ── Slide-ийн дотоод padding wrapper ─────────────────────────────────────────
export function SlidePad({ children, bg = OFFWHITE }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: bg, overflow: "hidden",
      padding: "clamp(64px,8vh,96px) 7vw clamp(56px,7vh,96px)", display: "flex", flexDirection: "column",
      fontFamily: FONT_BODY }}>
      {children}
    </div>
  );
}
