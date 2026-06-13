"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// MANDALA GARDEN — AWT KIOSK (1920×1080 landscape, touch)
// Концепц: AWT — Animal · Water · Tree. Байгальтай зохицсон амьдрах орчин.
// Scroll БАЙХГҮЙ. 8 slide. Attract(60с) / Auto-reset(90с). localStorage ашиглаагүй.
// Жинхэнэ медиа /assets дотроос. /* IMG */ = солих боломжтой зургийн байрлал.
// ============================================================================

// ── Албан ёсны палитр ──
const GREEN   = "#2E7D32"; // Forest Green — байгаль, гол accent, CTA
const BLUE    = "#4FC3F7"; // Sky Blue — ус, тайван
const MUSTARD = "#F9A825"; // Soft Mustard — дулаан, highlight/tagline
const CHARCOAL = "#212121"; // гарчиг, premium текст
const OFFWHITE = "#FAFAFA"; // background
const SAND    = "#F3E5AB";  // зөөлөн дулаан accent

// ── Фонт ──
const FONT_HEAD  = "'Mogul Magistral','Samsung Sharp Sans', var(--font-inter), sans-serif";
const FONT_BRAND = "'Gilroy','Samsung Sharp Sans', var(--font-inter), sans-serif";
const FONT_BODY  = "var(--font-inter), system-ui, sans-serif";
const FONT_ACCENT = "var(--font-playfair), Georgia, serif";

const IDLE_ATTRACT_MS = 60000;
const IDLE_RESET_MS   = 90000;
const ATTRACT_STEP_MS = 8000;

const A = {
  logo:        "/assets/logo/mandala-garden-logo.png",
  hero:        "/assets/images/fbouz.jpg",
  masterPlan:  encodeURI("/assets/All edited.jpg"),
  renderFinal: "/assets/images/final.png",
};
const plan = (block, n = 1) => encodeURI(`/assets/${block} (${n}).png`);
const PLAN_COUNTS = { "201": 0, "202": 8, "203": 7, "204": 7, "205": 7 };

// ─── Reduced motion ─────────────────────────────────────────────────────────────
function useReducedMotion() {
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

// ─── Media (зураг/видео) ─────────────────────────────────────────────────────────
function Media({ src, alt = "", grad = ["#9aa3b0", "#5a6a7e"], fit = "cover", bg = OFFWHITE, reduced }) {
  const [loaded, setLoaded] = useState(false);
  const vidRef = useRef(null);
  const isVideo = /\.(mp4|webm)$/i.test(src);
  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;
    if (reduced) v.pause(); else v.play?.().catch(() => {});
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

function LiveGradient({ colors, style, reduced }) {
  return (
    <motion.div
      style={{ position: "absolute", inset: 0, backgroundSize: "300% 300%",
        backgroundImage: `linear-gradient(135deg, ${colors.join(",")})`, ...style }}
      animate={reduced ? undefined : { backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
  );
}

// ─── Mandala motif (субтл эргэлдэх background overlay) ─────────────────────────
function MandalaMotif({ size = 620, color = GREEN, opacity = 0.06, reduced, style }) {
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

// ─── "• • •" divider ──────────────────────────────────────────────────────────
function TriDots({ color = GREEN, center }) {
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: center ? "center" : "flex-start", margin: "0 0 18px" }}>
      {[0, 1, 2].map((i) => <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />)}
    </div>
  );
}

// ─── Count-up ────────────────────────────────────────────────────────────────
function CountUp({ target, suffix = "", reduced }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (reduced) { setVal(target); return; }
    const t0 = performance.now(), dur = 1500;
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick); else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [target, reduced]);
  return <span>{val.toLocaleString()}{suffix}</span>;
}

// ─── Particles ──────────────────────────────────────────────────────────────────
function Particles({ count = 18, color = "rgba(255,255,255,0.5)", reduced }) {
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

// ─── Heading (нэг дэлгэцэд ганц том гарчиг) ───────────────────────────────────
function Heading({ children, kicker, kickerColor = GREEN, light, reduced }) {
  return (
    <div style={{ marginBottom: "min(3.5vh,34px)" }}>
      {kicker && (
        <>
          <TriDots color={kickerColor} />
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

// ─── Том touch товч (pill) ──────────────────────────────────────────────────────
function Pill({ children, onClick, variant = "green", style }) {
  const v = {
    green: { background: GREEN, color: "#fff" },
    blue:  { background: BLUE, color: CHARCOAL },
    light: { background: "#fff", color: CHARCOAL, border: `2px solid ${GREEN}33` },
    ghost: { background: "rgba(255,255,255,0.14)", color: "#fff", border: "2px solid rgba(255,255,255,0.4)" },
  }[variant];
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.96 }}
      style={{ minHeight: 64, padding: "0 clamp(28px,2.6vw,46px)", borderRadius: 40, border: "none",
        fontSize: "clamp(18px,1.4vw,24px)", fontWeight: 700, letterSpacing: "0.01em", cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 12,
        fontFamily: FONT_BODY, ...v, ...style }}>
      {children}
    </motion.button>
  );
}

// ─── Дата ───────────────────────────────────────────────────────────────────────
const STATS = [
  { n: 14,  s: "",   label: "Нийт блок" },
  { n: 10,  s: " га", label: "Газрын талбай" },
  { n: 2,   s: "",   label: "Цахилгааны эх үүсвэр" },
  { n: 600, s: " м", label: "Үерийн усны далан" },
  { n: 100, s: "%",  label: "PPR цэвэр усны хоолой" },
];
const AWT = [
  { key: "Animal", mn: "Амьтан", icon: "🦌", color: MUSTARD,
    desc: "Амьтны хүрээлэн, интерактив парк — байгалийн амьдралтай ойр дотно орчин." },
  { key: "Water", mn: "Ус", icon: "💧", color: BLUE,
    desc: "Усан төхөөрөмж, тунгалаг орчин, тайван амгалан мэдрэмж." },
  { key: "Tree", mn: "Мод", icon: "🌳", color: GREEN,
    desc: "Өргөн ногоон байгууламж, мод тарьсан зүлэгжүүлэлт, эрүүл амьсгал." },
];
const BLOCKS = [
  { name: "201", x: "36.5%", y: "51%",   area: "47.90–105.55", rooms: "2–4 өрөө", handover: "2027 II улирал" },
  { name: "202", x: "27.3%", y: "52.5%", area: "47.91–81.02",  rooms: "2–3 өрөө", handover: "2026–2027" },
  { name: "203", x: "30%",   y: "40.5%", area: "48.65–124.06", rooms: "2–4 өрөө", handover: "2026–2027" },
  { name: "204", x: "26.8%", y: "30%",   area: "47.55–105.84", rooms: "2–4 өрөө", handover: "2026–2027" },
  { name: "205", x: "34.5%", y: "29.5%", area: "48.69–125.86", rooms: "2–4 өрөө", handover: "2026–2027" },
];
const FLOOR_BLOCKS = BLOCKS.filter((b) => PLAN_COUNTS[b.name] > 0);
const AMENITIES = [
  { icon: "🧒", title: "Хүүхдийн тоглоомын талбай", sub: "3–5 · 6–8 · 8–12 насны ангилал", c: MUSTARD },
  { icon: "🏀", title: "3×3 сагсан бөмбөг", sub: "Спортын талбай", c: BLUE },
  { icon: "🌳", title: "Ногоон байгууламж", sub: "AWT зүлэгжүүлэлт", c: GREEN },
  { icon: "🦌", title: "AWT парк", sub: "Animal · Water · Tree", c: GREEN },
  { icon: "🏫", title: "Сургууль", sub: "Хороололд багтсан", c: BLUE },
  { icon: "🧸", title: "Цэцэрлэг", sub: "Хүүхдэд ээлтэй", c: MUSTARD },
  { icon: "🛍️", title: "Худалдаа үйлчилгээ", sub: "1 давхрын нэгж", c: GREEN },
];
const INFRA = [
  { icon: "⚡", k: "Цахилгаан", v: "2 эх үүсвэр", d: "Яармагийн дэд станцаас 2 км шугам — тасралтгүй." },
  { icon: "💧", k: "Цэвэр ус",  v: "100% PPR",   d: "Зэврэхгүй хуванцар хоолой, чанартай ус." },
  { icon: "🌊", k: "Үерийн ус", v: "600 м далан", d: "100 жилийн дундаж үерийг тооцсон хамгаалалт." },
];
const BRANDS = [
  { k: "Egger", d: "Паркет" }, { k: "VEKA / Firatpen", d: "Цонх" },
  { k: "Torex", d: "Гадна хаалга" }, { k: "Legrand", d: "Цахилгаан" },
  { k: "TOTO / INAX", d: "Ариун цэврийн тоног" },
];
const NEARBY = [
  { icon: "🏬", t: "Хүннү молл" }, { icon: "🎓", t: "British / Smart / Tomyo сургууль" },
  { icon: "🏥", t: "Хан-Уул нэгдсэн эмнэлэг" }, { icon: "⛰️", t: "Богдхан уул" },
  { icon: "🌊", t: "Туул гол" }, { icon: "🚌", t: "Яармаг тээврийн зангилаа" },
];

const SLIDE_NAMES = [
  "Нүүр", "Тоон үзүүлэлт", "AWT концепц", "Ерөнхий төлөвлөгөө",
  "Орон сууц", "Орчин", "Дэд бүтэц", "Байршил",
];
const SLIDE_COUNT = SLIDE_NAMES.length;

// ── Slide padding wrapper ──
function SlidePad({ children, bg = OFFWHITE }) {
  return (
    <div style={{ position: "absolute", inset: 0, background: bg, overflow: "hidden",
      padding: "clamp(64px,8vh,96px) 7vw 124px", display: "flex", flexDirection: "column",
      fontFamily: FONT_BODY }}>
      {children}
    </div>
  );
}

// ============================================================================
//  SLIDES
// ============================================================================

// ── 1. HERO ──
function SlideHero({ reduced, onStart }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <motion.div style={{ position: "absolute", inset: 0 }}
        initial={reduced ? {} : { scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 9, ease: "easeOut" }}>
        {/* IMG: hero байгалийн дэвсгэр (drone/lifestyle-ээр солих) */}
        <Media src={A.hero} grad={["#7c9a6b", "#3f5b46", "#22332a"]} reduced={reduced} />
      </motion.div>
      {/* зөөлөн green overlay */}
      <div style={{ position: "absolute", inset: 0,
        background: `linear-gradient(120deg, rgba(46,125,50,0.78) 0%, rgba(33,55,42,0.55) 45%, rgba(33,33,33,0.4) 100%)` }} />
      <MandalaMotif size={760} color="#fff" opacity={0.07} reduced={reduced}
        style={{ right: "-160px", top: "-160px" }} />
      <Particles count={20} reduced={reduced} />

      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "0 7vw", color: "#fff" }}>
        <img src={A.logo} alt="Mandala Garden" style={{ width: "clamp(96px,9vw,150px)", height: "auto", marginBottom: 28,
          filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.35))" }} />
        <p style={{ fontFamily: FONT_ACCENT, fontStyle: "italic", fontSize: "clamp(22px,2vw,38px)",
          color: SAND, margin: "0 0 14px" }}>
          Байгальтай зохицсон амьдрах орчин
        </p>
        <h1 style={{ fontFamily: FONT_HEAD, fontSize: "clamp(40px,4.4vw,76px)", fontWeight: 700,
          lineHeight: 1.06, margin: 0, maxWidth: 880 }}>
          Гэр бүлдээ үлдээх{" "}
          <span style={{ color: MUSTARD }}>үнэ цэнтэй</span> хөрөнгө оруулалт
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24,
          fontSize: "clamp(16px,1.3vw,22px)", color: "rgba(255,255,255,0.85)" }}>
          <span style={{ fontWeight: 700, color: MUSTARD, fontFamily: FONT_BRAND, letterSpacing: "0.08em" }}>AWT</span>
          Animal · Water · Tree · Яармаг–Арцатын хөндий · 10 га · 14 блок
        </div>
        <div style={{ marginTop: 40 }}>
          <Pill onClick={onStart}>Танилцуулга эхлэх →</Pill>
        </div>
      </div>
    </div>
  );
}

// ── 2. STATS ──
function SlideStats({ reduced }) {
  return (
    <SlidePad>
      <MandalaMotif size={520} color={GREEN} opacity={0.05} reduced={reduced} style={{ right: "-120px", bottom: "-120px" }} />
      <Heading kicker="Төслийн тоо баримт" reduced={reduced}>Цар хүрээгээ тоогоор</Heading>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${STATS.length},1fr)`, gap: "clamp(18px,2vw,38px)",
        flex: 1, alignContent: "center", position: "relative" }}>
        {STATS.map((st, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: reduced ? 0 : 26 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 * i }}
            style={{ borderTop: `3px solid ${[GREEN, BLUE, MUSTARD, GREEN, BLUE][i]}`, paddingTop: 22 }}>
            <div style={{ fontFamily: FONT_BRAND, fontSize: "clamp(48px,5.4vw,100px)", fontWeight: 900,
              lineHeight: 1, color: CHARCOAL, letterSpacing: "-0.02em" }}>
              <CountUp target={st.n} suffix={st.s} reduced={reduced} />
            </div>
            <div style={{ marginTop: 14, fontSize: "clamp(16px,1.2vw,22px)", color: "#555", lineHeight: 1.35 }}>
              {st.label}
            </div>
          </motion.div>
        ))}
      </div>
    </SlidePad>
  );
}

// ── 3. AWT КОНЦЕПЦ (брэндийн зүрх) ──
function SlideAWT({ reduced }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden",
      background: `linear-gradient(120deg, ${GREEN} 0%, ${BLUE} 55%, ${SAND} 100%)`,
      padding: "clamp(64px,8vh,96px) 7vw 124px", display: "flex", flexDirection: "column",
      fontFamily: FONT_BODY, color: "#fff" }}>
      <MandalaMotif size={900} color="#fff" opacity={0.08} reduced={reduced}
        style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <TriDots color="#fff" />
        <p style={{ letterSpacing: "0.22em", fontSize: "clamp(13px,1vw,18px)", textTransform: "uppercase",
          fontWeight: 700, margin: "0 0 10px", opacity: 0.9 }}>Брэндийн концепц</p>
        <h2 style={{ fontFamily: FONT_HEAD, fontSize: "clamp(34px,3vw,52px)", fontWeight: 700, margin: 0 }}>
          <span style={{ fontFamily: FONT_BRAND, letterSpacing: "0.04em" }}>AWT</span> — Байгальтай зохицсон амьдрал
        </h2>
      </div>
      <div style={{ position: "relative", zIndex: 2, flex: 1, display: "grid",
        gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(20px,2.4vw,44px)", alignItems: "center" }}>
        {AWT.map((a, i) => (
          <motion.div key={a.key} initial={{ opacity: 0, y: reduced ? 0 : 34 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 + i * 0.15 }}
            style={{ background: "rgba(255,255,255,0.14)", backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.25)", borderRadius: 24, padding: "clamp(24px,3vh,44px)",
              textAlign: "center" }}>
            <div style={{ width: "clamp(96px,8vw,140px)", height: "clamp(96px,8vw,140px)", margin: "0 auto 22px",
              borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "clamp(44px,4vw,72px)", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>{a.icon}</div>
            <div style={{ fontFamily: FONT_BRAND, fontSize: "clamp(20px,1.6vw,28px)", fontWeight: 900,
              letterSpacing: "0.06em", marginBottom: 4 }}>{a.key}</div>
            <div style={{ fontFamily: FONT_HEAD, fontSize: "clamp(24px,2vw,36px)", fontWeight: 700, marginBottom: 14 }}>{a.mn}</div>
            <p style={{ fontSize: "clamp(16px,1.2vw,22px)", lineHeight: 1.55, color: "rgba(255,255,255,0.92)", margin: 0 }}>
              {a.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── 4. MASTER PLAN ──
function SlideMasterPlan({ reduced }) {
  const [sel, setSel] = useState(null);
  const active = BLOCKS.find((b) => b.name === sel);
  return (
    <SlidePad>
      <Heading kicker="Ерөнхий төлөвлөгөө · Нийт 14 блок" reduced={reduced}>Нэгдсэн төлөвлөлт</Heading>
      <p style={{ fontSize: "clamp(16px,1.2vw,22px)", color: "#555", margin: "-18px 0 16px" }}>
        201–205 блок дээр дарж дэлгэрэнгүйг үзнэ үү
      </p>
      <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", aspectRatio: "1920 / 1077",
          width: "min(100%, calc((100vh - 360px) * 1.783))", borderRadius: 16, overflow: "hidden",
          background: "#fff", boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
          {/* IMG: Нэгдсэн төлөвлөлт (All edited.jpg) */}
          <Media src={A.masterPlan} grad={["#9aa3b0", "#5a6a7e"]} fit="cover" bg="#fff" reduced={reduced} />
          {BLOCKS.map((b, i) => {
            const on = sel === b.name;
            // wrapper нь CSS transform-оор төвлүүлнэ; motion зөвхөн scale-г хөдөлгөнө
            return (
              <div key={b.name} style={{ position: "absolute", left: b.x, top: b.y,
                transform: "translate(-50%,-50%)" }}>
                <motion.button onClick={() => setSel(on ? null : b.name)}
                  animate={reduced ? {} : { scale: on ? 1.18 : [1, 1.1, 1] }}
                  transition={on ? { duration: 0.2 } : { duration: 2.4, repeat: Infinity, delay: i * 0.4 }}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center",
                    width: "clamp(46px,3.6vw,62px)", height: "clamp(46px,3.6vw,62px)", borderRadius: "50%",
                    cursor: "pointer", border: `3px solid #fff`,
                    background: on ? GREEN : "rgba(46,125,50,0.88)", color: "#fff",
                    fontFamily: FONT_BRAND, fontSize: "clamp(15px,1.15vw,21px)", fontWeight: 900,
                    boxShadow: on ? `0 0 0 7px rgba(46,125,50,0.32),0 8px 24px rgba(0,0,0,0.4)`
                                  : `0 3px 14px rgba(0,0,0,0.35)` }}>
                  {b.name}
                </motion.button>
              </div>
            );
          })}

          {/* popup — flex-ээр төвлүүлсэн wrapper (transform зөрчилгүй) */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, display: "flex",
            justifyContent: "center", padding: "0 16px", pointerEvents: "none" }}>
            <AnimatePresence>
              {active && (
                <motion.div key={active.name} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.3 }}
                  style={{ pointerEvents: "auto", background: "rgba(255,255,255,0.97)", borderRadius: 18,
                    padding: "18px 26px", maxWidth: "min(820px,96%)", boxShadow: "0 18px 60px rgba(0,0,0,0.3)",
                    display: "flex", gap: "clamp(18px,2vw,30px)", alignItems: "center", flexWrap: "nowrap" }}>
                  <div style={{ fontFamily: FONT_HEAD, fontSize: "clamp(26px,2.2vw,40px)", fontWeight: 700, color: GREEN, lineHeight: 1, whiteSpace: "nowrap" }}>
                    {active.name}<span style={{ fontSize: "0.45em", fontWeight: 400, color: "#777", fontFamily: FONT_BODY }}> блок</span>
                  </div>
                  <div style={{ width: 1, alignSelf: "stretch", background: "#0002" }} />
                  <CardStat k="Талбай" v={`${active.area} м²`} />
                  <CardStat k="Өрөө" v={active.rooms} />
                  <CardStat k="Ашиглалт" v={active.handover} />
                  <button onClick={() => setSel(null)} style={{ flexShrink: 0, width: 48, height: 48, borderRadius: "50%",
                    border: "none", background: OFFWHITE, color: CHARCOAL, fontSize: 24, cursor: "pointer", fontWeight: 700 }}>×</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SlidePad>
  );
}
function CardStat({ k, v }) {
  return (
    <div>
      <div style={{ fontSize: "clamp(12px,0.9vw,16px)", color: "#888", textTransform: "uppercase",
        letterSpacing: "0.08em", marginBottom: 5 }}>{k}</div>
      <div style={{ fontSize: "clamp(18px,1.5vw,28px)", fontWeight: 700, color: CHARCOAL }}>{v}</div>
    </div>
  );
}

// ── 5. FLOOR PLANS (gallery + lightbox) ──
function SlideFloorPlans({ reduced }) {
  const [block, setBlock] = useState(FLOOR_BLOCKS[0].name);
  const [box, setBox] = useState(null);
  const count = PLAN_COUNTS[block];
  const images = Array.from({ length: count }, (_, i) => plan(block, i + 1));
  const info = BLOCKS.find((b) => b.name === block);
  return (
    <SlidePad>
      <Heading kicker="Орон сууц · 2–4 өрөө · 47–126 м²" kickerColor={BLUE} reduced={reduced}>Давхрын хуваалт</Heading>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18, alignItems: "center" }}>
        {FLOOR_BLOCKS.map((b) => {
          const on = b.name === block;
          return (
            <motion.button key={b.name} onClick={() => setBlock(b.name)} whileTap={{ scale: 0.96 }}
              style={{ minHeight: 60, padding: "0 28px", borderRadius: 36, cursor: "pointer",
                border: on ? `2px solid ${GREEN}` : `2px solid #0001`, background: on ? GREEN : "#fff",
                color: on ? "#fff" : CHARCOAL, fontFamily: FONT_BRAND, fontSize: "clamp(18px,1.4vw,26px)", fontWeight: 900 }}>
              {b.name}
            </motion.button>
          );
        })}
        <div style={{ marginLeft: "auto", fontSize: "clamp(15px,1.1vw,20px)", color: "#555" }}>
          {info.area} м² · {info.rooms} · {count} хувилбар
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexWrap: "wrap", gap: 16,
        alignContent: "flex-start", justifyContent: "center", overflow: "hidden" }}>
        {images.map((src, i) => (
          <motion.button key={src} onClick={() => setBox(i)} whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: reduced ? 0 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.04 }}
            style={{ position: "relative", width: "clamp(148px,12.5vw,205px)", aspectRatio: "1", borderRadius: 12,
              overflow: "hidden", cursor: "pointer", padding: 0, border: "1px solid #0001", background: "#fff" }}>
            {/* IMG: блокийн давхрын хуваалт зураг */}
            <Media src={src} grad={["#cfd6dd", "#9aa3b0"]} fit="contain" bg="#fff" reduced={reduced} />
            <span style={{ position: "absolute", left: 10, bottom: 8, background: GREEN, color: "#fff",
              fontSize: 14, fontWeight: 700, padding: "3px 10px", borderRadius: 10 }}>{i + 1}</span>
          </motion.button>
        ))}
      </div>
      <Lightbox images={images} index={box} label={`${block} блок`}
        onClose={() => setBox(null)}
        onPrev={() => setBox((v) => (v - 1 + count) % count)}
        onNext={() => setBox((v) => (v + 1) % count)} reduced={reduced} />
    </SlidePad>
  );
}
function Lightbox({ images, index, label, onClose, onPrev, onNext, reduced }) {
  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(20,28,22,0.95)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 1100, marginBottom: 16 }}>
            <span style={{ color: "#fff", fontFamily: FONT_HEAD, fontSize: "clamp(22px,1.8vw,32px)", fontWeight: 700 }}>
              {label} · {index + 1}/{images.length}
            </span>
            <button onClick={onClose} style={{ width: 64, height: 64, borderRadius: "50%", border: "none",
              background: GREEN, color: "#fff", fontSize: 32, fontWeight: 700, cursor: "pointer" }}>×</button>
          </div>
          <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 24,
            width: "100%", maxWidth: 1100, flex: 1, minHeight: 0 }}>
            <Round onClick={onPrev}>‹</Round>
            <div style={{ flex: 1, height: "100%", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
              <AnimatePresence mode="wait">
                <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }} style={{ width: "100%", height: "100%" }}>
                  <Media src={images[index]} grad={["#cfd6dd", "#9aa3b0"]} fit="contain" bg="#fff" reduced={reduced} />
                </motion.div>
              </AnimatePresence>
            </div>
            <Round onClick={onNext}>›</Round>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
function Round({ children, onClick }) {
  return (
    <motion.button onClick={onClick} whileTap={{ scale: 0.9 }}
      style={{ flexShrink: 0, width: 84, height: 84, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.5)",
        background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 48, lineHeight: 1, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", paddingBottom: 6 }}>{children}</motion.button>
  );
}

// ── 6. AMENITIES ──
function SlideAmenities({ reduced }) {
  const [open, setOpen] = useState(null);
  return (
    <SlidePad>
      <Heading kicker="Орчин · AWT амьдрал" reduced={reduced}>Амьдралыг бүрдүүлэх орчин</Heading>
      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        gridAutoRows: "1fr", gap: "clamp(14px,1.4vw,24px)", alignContent: "center" }}>
        {AMENITIES.map((a, i) => {
          const on = open === i;
          return (
            <motion.button key={i} onClick={() => setOpen(on ? null : i)}
              initial={{ opacity: 0, y: reduced ? 0 : 26 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 * i }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 14, padding: "clamp(16px,2.2vh,32px) 14px", borderRadius: 20, cursor: "pointer",
                background: on ? a.c : "#fff", color: on ? "#fff" : CHARCOAL,
                border: `2px solid ${on ? a.c : "#0001"}` }}>
              <div style={{ width: "clamp(72px,5vw,104px)", height: "clamp(72px,5vw,104px)", borderRadius: "50%",
                background: on ? "rgba(255,255,255,0.22)" : a.c + "1a", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "clamp(34px,2.8vw,52px)" }}>{a.icon}</div>
              <div style={{ fontFamily: FONT_HEAD, fontSize: "clamp(16px,1.2vw,23px)", fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>
                {a.title}
              </div>
              <div style={{ fontSize: "clamp(13px,0.95vw,18px)", textAlign: "center",
                color: on ? "rgba(255,255,255,0.85)" : "#777", lineHeight: 1.35 }}>{a.sub}</div>
            </motion.button>
          );
        })}
      </div>
    </SlidePad>
  );
}

// ── 7. INFRASTRUCTURE ──
function SlideInfra({ reduced }) {
  return (
    <SlidePad bg={CHARCOAL}>
      <MandalaMotif size={560} color={GREEN} opacity={0.1} reduced={reduced} style={{ right: "-130px", top: "-100px" }} />
      <Heading kicker="Инженерийн шийдэл" kickerColor={MUSTARD} light reduced={reduced}>Найдвартай дэд бүтэц</Heading>
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(24px,2.4vw,44px)" }}>
        {INFRA.map((it, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: reduced ? 0 : 26 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }} style={{ borderTop: `3px solid ${[GREEN, BLUE, MUSTARD][i]}`, paddingTop: 24 }}>
            <div style={{ fontSize: "clamp(38px,3.2vw,58px)", marginBottom: 12 }}>{it.icon}</div>
            <div style={{ fontSize: "clamp(14px,1vw,19px)", color: [GREEN, BLUE, MUSTARD][i], textTransform: "uppercase",
              letterSpacing: "0.1em", marginBottom: 8, fontWeight: 700 }}>{it.k}</div>
            <div style={{ fontFamily: FONT_HEAD, fontSize: "clamp(30px,2.6vw,46px)", fontWeight: 700, color: "#fff", marginBottom: 14 }}>{it.v}</div>
            <p style={{ fontSize: "clamp(16px,1.2vw,22px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.5, margin: 0 }}>{it.d}</p>
          </motion.div>
        ))}
      </div>
      <div style={{ position: "relative", marginTop: "min(5vh,48px)", paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.14)" }}>
        <p style={{ fontSize: "clamp(14px,1vw,19px)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.14em",
          textTransform: "uppercase", marginBottom: 20 }}>Материалын брэндүүд</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(12px,1.2vw,24px)" }}>
          {BRANDS.map((b, i) => (
            <div key={i} style={{ padding: "16px 24px", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12 }}>
              <div style={{ fontFamily: FONT_BRAND, fontSize: "clamp(18px,1.4vw,26px)", fontWeight: 900, color: "#fff" }}>{b.k}</div>
              <div style={{ fontSize: "clamp(13px,0.95vw,17px)", color: MUSTARD, marginTop: 4 }}>{b.d}</div>
            </div>
          ))}
        </div>
      </div>
    </SlidePad>
  );
}

// ── 8. LOCATION + CONTACT ──
function SlideLocation({ reduced }) {
  return (
    <SlidePad>
      <Heading kicker="Байршил · Хан-Уул дүүрэг · 23-р хороо" kickerColor={BLUE} reduced={reduced}>Яармаг–Арцатын хөндий</Heading>
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 44, flex: 1, minHeight: 0 }}>
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
          {/* IMG: байршлын render / газрын зураг */}
          <Media src={A.renderFinal} grad={["#9aa3b0", "#5a6a7e"]} fit="contain" bg="#fff" reduced={reduced} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1, alignContent: "center" }}>
            {NEARBY.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: reduced ? 0 : 18 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "#fff",
                  borderRadius: 14, border: `1px solid #0001` }}>
                <span style={{ fontSize: "clamp(24px,2vw,34px)" }}>{p.icon}</span>
                <span style={{ fontSize: "clamp(15px,1.15vw,21px)", fontWeight: 500, lineHeight: 1.25 }}>{p.t}</span>
              </motion.div>
            ))}
          </div>
          {/* contact */}
          <div style={{ marginTop: 18, padding: "22px 26px", borderRadius: 18, background: GREEN, color: "#fff",
            display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "clamp(14px,1vw,18px)", opacity: 0.85, marginBottom: 4 }}>
                Холбоо барих · Загварын байр 09:00–18:00
              </div>
              <a href="tel:75758000" style={{ textDecoration: "none", color: "#fff" }}>
                <div style={{ fontFamily: FONT_BRAND, fontSize: "clamp(34px,3vw,56px)", fontWeight: 900, letterSpacing: "0.02em" }}>
                  📞 7575-8000
                </div>
              </a>
            </div>
            {/* QR: загварын байр / вэб холбоосын QR код тавих */}
            <div style={{ width: "clamp(96px,8vw,128px)", height: "clamp(96px,8vw,128px)", background: "#fff", borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 14,
              fontWeight: 600, textAlign: "center", flexShrink: 0 }}>QR<br />код</div>
          </div>
        </div>
      </div>
    </SlidePad>
  );
}

// ============================================================================
//  KIOSK SHELL
// ============================================================================
export default function MandalaGarden() {
  const reduced = useReducedMotion();
  const [[slide, dir], setS] = useState([0, 0]);
  const [attract, setAttract] = useState(false);
  const attractTimer = useRef(null);
  const resetTimer = useRef(null);

  const goTo = useCallback((i) => setS(([s]) => [i, i > s ? 1 : -1]), []);
  const next = useCallback(() => setS(([s]) => [Math.min(s + 1, SLIDE_COUNT - 1), 1]), []);
  const prev = useCallback(() => setS(([s]) => [Math.max(s - 1, 0), -1]), []);

  const bump = useCallback(() => {
    setAttract(false);
    clearTimeout(attractTimer.current);
    clearTimeout(resetTimer.current);
    attractTimer.current = setTimeout(() => { setAttract(true); setS([0, 1]); }, IDLE_ATTRACT_MS);
    resetTimer.current   = setTimeout(() => { setS([0, 0]); }, IDLE_RESET_MS);
  }, []);

  useEffect(() => {
    bump();
    return () => { clearTimeout(attractTimer.current); clearTimeout(resetTimer.current); };
  }, [bump]);

  useEffect(() => {
    if (!attract) return;
    const id = setInterval(() => setS(([s]) => [(s + 1) % SLIDE_COUNT, 1]), ATTRACT_STEP_MS);
    return () => clearInterval(id);
  }, [attract]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") { bump(); next(); }
      else if (e.key === "ArrowLeft") { bump(); prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bump, next, prev]);

  const slides = [
    <SlideHero key="hero" reduced={reduced} onStart={() => { bump(); next(); }} />,
    <SlideStats key="stats" reduced={reduced} />,
    <SlideAWT key="awt" reduced={reduced} />,
    <SlideMasterPlan key="master" reduced={reduced} />,
    <SlideFloorPlans key="floor" reduced={reduced} />,
    <SlideAmenities key="amen" reduced={reduced} />,
    <SlideInfra key="infra" reduced={reduced} />,
    <SlideLocation key="loc" reduced={reduced} />,
  ];

  const variants = {
    enter: (d) => ({ x: reduced ? 0 : (d > 0 ? "100%" : "-100%"), opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: reduced ? 0 : (d > 0 ? "-100%" : "100%"), opacity: 0 }),
  };

  const darkUi = slide === 0 || slide === 2 || slide === 6; // hero, AWT, infra

  return (
    <div onPointerDown={bump}
      style={{ position: "fixed", inset: 0, overflow: "hidden", background: OFFWHITE,
        fontFamily: FONT_BODY, color: CHARCOAL, cursor: "default" }}>

      <AnimatePresence custom={dir} initial={false}>
        <motion.div key={slide} custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} style={{ position: "absolute", inset: 0 }}>
          {slides[slide]}
        </motion.div>
      </AnimatePresence>

      {/* logo (top-left) — hero дээр өөрийн логотой тул нуух */}
      {slide !== 0 && (
        <img src={A.logo} alt="Mandala Garden"
          style={{ position: "fixed", top: 26, left: "7vw", width: 56, height: "auto", zIndex: 60,
            filter: darkUi ? "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" : "none" }} />
      )}

      {/* progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 4, zIndex: 60, background: "rgba(0,0,0,0.06)" }}>
        <motion.div style={{ height: "100%", background: GREEN }}
          animate={{ width: `${((slide + 1) / SLIDE_COUNT) * 100}%` }} transition={{ duration: 0.5 }} />
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, height: 104, zIndex: 70,
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 5vw",
        background: darkUi ? "rgba(33,33,33,0.5)" : "rgba(250,250,250,0.82)", backdropFilter: "blur(10px)",
        borderTop: `1px solid ${darkUi ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}` }}>
        <NavBtn onClick={() => { bump(); prev(); }} disabled={slide === 0} dark={darkUi}>← Өмнөх</NavBtn>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {SLIDE_NAMES.map((nm, i) => (
            <button key={i} onClick={() => { bump(); goTo(i); }} title={nm}
              style={{ width: i === slide ? 42 : 14, height: 14, borderRadius: 7, border: "none", cursor: "pointer",
                transition: "all 0.3s", background: i === slide ? GREEN : (darkUi ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.18)") }} />
          ))}
        </div>
        <NavBtn onClick={() => { bump(); next(); }} disabled={slide === SLIDE_COUNT - 1} dark={darkUi} primary>Дараах →</NavBtn>
      </div>

      {/* ATTRACT overlay */}
      <AnimatePresence>
        {attract && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 80, pointerEvents: "none",
              display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 144 }}>
            <motion.div animate={reduced ? {} : { y: [0, -10, 0], opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              style={{ background: GREEN, color: "#fff", padding: "18px 42px", borderRadius: 44,
                fontSize: "clamp(18px,1.4vw,28px)", fontWeight: 700, boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}>
              👆 Эхлэхийн тулд дэлгэцэд хүрнэ үү
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavBtn({ children, onClick, disabled, dark, primary }) {
  return (
    <motion.button onClick={onClick} disabled={disabled} whileTap={disabled ? {} : { scale: 0.95 }}
      style={{ minHeight: 72, minWidth: 190, padding: "0 36px", borderRadius: 40, border: "none",
        fontFamily: FONT_BODY, fontSize: "clamp(18px,1.4vw,26px)", fontWeight: 700, letterSpacing: "0.01em",
        cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.3 : 1,
        background: primary ? GREEN : (dark ? "rgba(255,255,255,0.15)" : "#fff"),
        color: primary ? "#fff" : (dark ? "#fff" : CHARCOAL),
        boxShadow: primary ? "0 6px 24px rgba(46,125,50,0.4)" : "0 4px 16px rgba(0,0,0,0.1)" }}>
      {children}
    </motion.button>
  );
}
