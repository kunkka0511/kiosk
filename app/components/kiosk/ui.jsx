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

// ── Lotus хээ — "/assets/pattern/garden pattern.svg"-ийн зам (gradient fill хассан) ──
//  Бүх watermark эндээс path-аа авна (давхардуулахгүй).
const LOTUS_D = [
  "M310.93,271.38c.62-70.93,53.68-130.88,122.86-144.25,39.43,59.5,31.51,139.12-18.79,190.1l-105.38,103.77,1.31-149.62ZM408.48,309.16c45.24-44.73,52.74-115.81,20.64-170.48-62.6,14.79-107.17,70.89-108.33,135.3l-.67,122.56,88.37-87.38Z",
  "M421.83,322.85c50.83-49.99,131.19-55.31,189.59-15.64-14.65,70.49-77.03,121.68-149.18,121.19l-146.72-1.01,106.3-104.54ZM466.21,418.22c63.34-1.77,117.98-45.23,133.68-106.34-54.41-33.05-124.62-25.61-171.03,18l-88.53,87.39,125.88.95Z",
  "M457.94,124.43l151.56,1.09-168.04,165.33c29.65-52.36,29.08-114.04-2.77-164.42,6.45-1.36,12.51-1.45,19.25-2ZM468.83,249.81l116.07-114.36-129.76-.8c18.09,35.96,22.7,75.12,13.69,115.17Z",
  "M311.06,236.81L312.6.05l100.93,102.32c6.45,6.67,12.62,13.01,17.27,20.85-59.05,12.55-103.93,56.08-119.74,113.59ZM410.78,114l-88.2-89.41-1.06,163.01c22.11-34.04,53.31-58.16,91.36-70.17.38-1.49-1.23-2.01-2.1-3.44Z",
  "M447.54,297.48l167.97-165.88-.98,148.61c-.47,7.55-.47,14.57-2.5,22.03-50.61-32.63-112.17-33.61-164.49-4.76ZM604.26,285.85l.94-129.82-116.08,114.54c39.82-8.42,78.94-3.46,115.14,15.28Z",
  "M302.88,420.95l-103.9-105.25c-49.57-51.69-56.36-131.41-16.1-190.35,68.98,14.34,121.19,75.03,120.81,145.97l-.81,149.63ZM292.74,396.34l1.06-122.56c-.25-64.42-44.02-121.14-106.41-136.81-32.88,54.21-26.38,125.39,18.22,170.76l87.13,88.62Z",
  "M296.9,427.26l-146.72-1.07c-72.14-.53-133.8-52.59-147.45-123.28,58.96-38.84,139.23-32.38,189.35,18.32l104.81,106.03ZM272.23,416.79l-87.28-88.63c-45.78-44.27-115.88-52.7-170.76-20.42,14.83,61.32,68.85,105.55,132.16,108.22l125.88.83Z",
  "M178,124.59c-32.56,49.92-34.01,111.59-5.1,164.36L7.22,121.26l151.56,1.05c6.73.65,12.79.83,19.22,2.27ZM161.44,132.57l-129.75-1.03,114.44,115.99c-8.44-40.17-3.28-79.26,15.32-114.96Z",
  "M185.93,121.49c4.76-7.77,11.01-14.02,17.56-20.6L305.86,0l-1.81,236.76c-15-57.73-59.25-101.89-118.12-115.27ZM203.94,115.95c37.88,12.54,68.73,37.1,90.36,71.45l1.25-163.01-89.45,88.15c-.89,1.41-2.51,1.91-2.15,3.41Z",
  "M2.19,297.92c-1.93-7.49-1.83-14.51-2.19-22.06L1.12,127.25l165.61,168.24c-51.91-29.59-113.48-29.48-164.54,2.43ZM125.54,268L11.09,151.83l-.9,129.82c36.46-18.22,75.65-22.63,115.35-13.65Z",
];

const LOTUS_RATIO = 428.4 / 615.51;

// ── Hero булангийн lotus watermark — outline, цагаан, 16s "амьсгалах" (globals.css) ──
export function HeroLotus() {
  return (
    <div className="hero-lotus" aria-hidden="true">
      <svg viewBox="0 0 615.51 428.4" xmlns="http://www.w3.org/2000/svg">
        {LOTUS_D.map((d, i) => <path key={i} d={d} />)}
      </svg>
    </div>
  );
}

// ── LotusMark — дурын байрлал/хэмжээтэй subtle lotus watermark (outline only) ──
//  style-аар байрлал (top/left/right/bottom) өг. Текстийн АРД, pointer-events байхгүй.
//  reduced биш бол маш удаан "амьсгална" (delay-ээр instance бүр өөр фазтай).
export function LotusMark({ size = 320, color = GREEN, opacity = 0.06, strokeWidth = 1.4,
  breatheDur = 20, delay = 0, reduced, style }) {
  return (
    <motion.svg viewBox="0 0 615.51 428.4" width={size} height={size * LOTUS_RATIO} aria-hidden="true"
      style={{ position: "absolute", overflow: "visible", pointerEvents: "none", ...style }}
      initial={{ opacity }}
      animate={reduced ? {} : { rotate: [-3, 3, -3], scale: [1, 1.04, 1], opacity: [opacity * 0.8, opacity, opacity * 0.8] }}
      transition={reduced ? {} : { duration: breatheDur, delay, repeat: Infinity, ease: "easeInOut" }}>
      {LOTUS_D.map((d, i) => <path key={i} d={d} fill="none" stroke={color} strokeWidth={strokeWidth} />)}
    </motion.svg>
  );
}

// ── SlideDecor — нэг slide-д 3 lotus (том/дунд/жижиг) булангуудаас урсаж, subtle ──
//  Нэг мөрөөр slide-д нэмнэ. tone="light" (цайвар дэвсгэр) / "dark" (бараан дэвсгэр).
export function SlideDecor({ reduced, tone = "light", color }) {
  const c = color || (tone === "dark" ? "#FFFFFF" : GREEN);
  const base = tone === "dark" ? 0.12 : 0.16; // цайвар дэвсгэр дээр харагдахуйц байх
  return (
    <>
      <LotusMark reduced={reduced} color={c} opacity={base}        size={540} strokeWidth={2.0} breatheDur={23} delay={0}   style={{ right: -160, bottom: -180 }} />
      <LotusMark reduced={reduced} color={c} opacity={base * 0.9}  size={300} strokeWidth={2.4} breatheDur={19} delay={2.5} style={{ left: -120, top: -110 }} />
      <LotusMark reduced={reduced} color={c} opacity={base * 1.1}  size={140} strokeWidth={3.0} breatheDur={16} delay={1.2} style={{ right: "6%", top: "10%" }} />
    </>
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
        <p style={{ letterSpacing: "0.22em", fontSize: "clamp(13px,1vw,18px)", textTransform: "uppercase",
          color: kickerColor, margin: "0 0 12px", fontWeight: 700, fontFamily: FONT_BODY }}>{kicker}</p>
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

// ── Брэндийн доод footer: богино зураас + 3 өнгийн цэг (Zoo·Water·Forest) ──────
//  Slide бүрийн доод-зүүн буланд. Логотой давхцахгүй (дээр биш ДООР), progress
//  цэгүүд төвд тул мөргөлдөхгүй. pointer-events байхгүй.
export function BrandFooter() {
  const cols = [MUSTARD, BLUE, GREEN]; // Zoo шар · Water цэнхэр · Forest ногоон
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "7vw", bottom: "clamp(20px,3vh,36px)",
      display: "flex", alignItems: "center", gap: 10, pointerEvents: "none", zIndex: 6 }}>
      <span style={{ width: "clamp(40px,5vw,72px)", height: 2, background: GREEN, borderRadius: 2, opacity: 0.55 }} />
      {cols.map((c, i) => <span key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
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
      <BrandFooter />
    </div>
  );
}
