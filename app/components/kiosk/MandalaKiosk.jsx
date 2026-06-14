"use client";
// ============================================================================
//  MANDALA GARDEN — KIOSK SHELL
//  • Удирдлага ЗӨВХӨН ГАРААР: хэвтээ swipe (Framer Motion drag="x").
//    Чирэх үед slide хуруу дагаж rubber-band, тавихад offset/velocity-оор
//    дараагийн slide руу spring-ээр snap. ← → / "дараах" BUTTON БАЙХГҮЙ.
//  • Доор subtle indicator цэгүүд + эхэнд "← шудраж үзнэ үү →" hint
//    (эхний swipe-аар үүрд алга болно).
//  • ATTRACT (60с) — hero руу буцаж slide-ууд аажуухан автоматаар гүйнэ.
//  • AUTO-RESET (90с) — slide 1 рүү буцна. Хүрэх болгонд timer reset.
//  • State бүгд useState/useRef-т. localStorage БҮҮ ашигла (kiosk-д цэвэрлэгдэхгүй).
// ============================================================================
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GREEN, CHARCOAL, FONT_BODY, FONT_ACCENT, A, IDLE_ATTRACT_MS, IDLE_RESET_MS, ATTRACT_STEP_MS } from "./tokens";
import { useReducedMotion } from "./ui";
import { SLIDES } from "./slides";
import CursorFX from "./CursorFX";
import ShaderBackground from "./ShaderBackground";

const COUNT = SLIDES.length;
const SWIPE_THRESHOLD = 90; // px — snap хийх босго (offset + velocity нийлбэр)

export default function MandalaKiosk() {
  const reduced = useReducedMotion();
  const [[slide, dir], setS] = useState([0, 0]);
  const [hasSwiped, setHasSwiped] = useState(false);
  const [attract, setAttract] = useState(false);
  const attractTimer = useRef(null);
  const resetTimer = useRef(null);

  const next = useCallback(() => setS(([s]) => [Math.min(s + 1, COUNT - 1), 1]), []);
  const prev = useCallback(() => setS(([s]) => [Math.max(s - 1, 0), -1]), []);

  // хүрэлцээ болгонд idle timer-уудыг reset
  const bump = useCallback(() => {
    setAttract(false);
    clearTimeout(attractTimer.current);
    clearTimeout(resetTimer.current);
    attractTimer.current = setTimeout(() => { setAttract(true); setS([0, 1]); }, IDLE_ATTRACT_MS);
    resetTimer.current = setTimeout(() => { setS([0, 0]); }, IDLE_RESET_MS);
  }, []);

  useEffect(() => {
    bump();
    return () => { clearTimeout(attractTimer.current); clearTimeout(resetTimer.current); };
  }, [bump]);

  // attract үед slide аажуухан автоматаар солигдоно
  useEffect(() => {
    if (!attract) return;
    const id = setInterval(() => setS(([s]) => [(s + 1) % COUNT, 1]), ATTRACT_STEP_MS);
    return () => clearInterval(id);
  }, [attract]);

  // (нэмэлт) гарын товчлуур — зөвхөн тест/танхимын нөөц, заавал биш
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") { bump(); next(); }
      else if (e.key === "ArrowLeft") { bump(); prev(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bump, next, prev]);

  // swipe тавихад — offset болон velocity-г нийлүүлж шийднэ
  const onDragEnd = (_e, info) => {
    bump();
    const power = info.offset.x + info.velocity.x * 0.25;
    if (power < -SWIPE_THRESHOLD && slide < COUNT - 1) { setHasSwiped(true); next(); }
    else if (power > SWIPE_THRESHOLD && slide > 0) { setHasSwiped(true); prev(); }
  };

  const variants = {
    enter: (d) => ({ x: reduced ? 0 : (d > 0 ? "100%" : "-100%"), opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: reduced ? 0 : (d > 0 ? "-100%" : "100%"), opacity: 0 }),
  };

  const dark = SLIDES[slide].dark;
  const Active = SLIDES[slide].Comp;

  return (
    <div onPointerDown={bump}
      style={{ position: "fixed", inset: 0, overflow: "hidden", background: "transparent", fontFamily: FONT_BODY, color: CHARCOAL }}>

      {/* WebGL shader background — бүх контентын ард (z-index 0) */}
      <ShaderBackground />

      <AnimatePresence custom={dir} initial={false}>
        <motion.div key={slide} custom={dir} variants={variants} initial="enter" animate="center" exit="exit"
          transition={{ x: { type: "spring", stiffness: 320, damping: 36 }, opacity: { duration: 0.35 } }}
          // ── ГАРААР SWIPE ──
          drag={reduced ? false : "x"}
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.55}        // rubber-band — хуруу дагах мэдрэмж
          dragMomentum={false}
          onDragEnd={onDragEnd}
          style={{ position: "absolute", inset: 0, zIndex: 1, touchAction: "pan-y" }}>
          <Active reduced={reduced} />
        </motion.div>
      </AnimatePresence>

      {/* ГЛОБАЛ cursor усан эффект — бүх слайд дээр (swipe/tap-д саадгүй) */}
      <CursorFX reduced={reduced} />

      {/* лого (top-left) — hero дээр өөрийн логотой тул нуух */}
      {slide !== 0 && (
        <img src={A.logo} alt="Mandala Garden"
          style={{ position: "fixed", top: 26, left: "7vw", width: 56, height: "auto", zIndex: 60,
            filter: dark ? "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" : "none", pointerEvents: "none" }} />
      )}

      {/* progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 4, zIndex: 60, background: "rgba(0,0,0,0.06)" }}>
        <motion.div style={{ height: "100%", background: GREEN }} animate={{ width: `${((slide + 1) / COUNT) * 100}%` }} transition={{ duration: 0.5 }} />
      </div>

      {/* indicator цэгүүд (зөвхөн харагдах — товч БИШ) */}
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 30, zIndex: 60, display: "flex", justifyContent: "center", gap: 10, pointerEvents: "none" }}>
        {SLIDES.map((_, i) => (
          <span key={i} style={{ width: i === slide ? 34 : 10, height: 10, borderRadius: 6, transition: "all 0.35s",
            background: i === slide ? GREEN : (dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.2)") }} />
        ))}
      </div>

      {/* swipe hint — эхний swipe хүртэл */}
      <AnimatePresence>
        {!hasSwiped && !attract && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", left: 0, right: 0, bottom: 64, zIndex: 60, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
            <motion.div animate={reduced ? {} : { opacity: [0.45, 1, 0.45], x: [-6, 6, -6] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontFamily: FONT_ACCENT, fontStyle: "italic", fontSize: "clamp(16px,1.3vw,24px)", fontWeight: 500,
                color: dark ? "rgba(255,255,255,0.92)" : "#444", letterSpacing: "0.02em" }}>
              ← &nbsp;шудраж үзнэ үү&nbsp; →
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ATTRACT overlay */}
      <AnimatePresence>
        {attract && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 80, pointerEvents: "none", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 120 }}>
            <motion.div animate={reduced ? {} : { y: [0, -10, 0], opacity: [0.75, 1, 0.75] }} transition={{ duration: 2.2, repeat: Infinity }}
              style={{ background: GREEN, color: "#fff", padding: "18px 42px", borderRadius: 44, fontSize: "clamp(18px,1.4vw,28px)", fontWeight: 700, boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}>
              👆 Эхлэхийн тулд дэлгэцэд хүрнэ үү
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
