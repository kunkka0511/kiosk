"use client";
// ============================================================================
//  MANDALA GARDEN — SHOWROOM SLIDE-УУД
//  Swipe-аар солигдоно. Slide бүр бүтэн дэлгэцэд (1920×1080), scroll БАЙХГҮЙ.
//  Гол зорилго: SHOWROOM — рендер, төлөвлөлт, орчныг гоё харуулах.
//  (AWT concept болон видеотой showcase хуудсуудыг хассан. Cursor эффект нь
//   глобал — CursorFX.jsx-д бүх слайд дээр ажиллана.)
// ============================================================================
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GREEN, BLUE, MUSTARD, CHARCOAL, OFFWHITE, SAND, DARK,
  FONT_HEAD, FONT_BRAND, FONT_BODY, FONT_ACCENT,
  A, plan, PLAN_COUNTS, STATS, BLOCKS, BLOCK_NOTE,
  AMENITIES, INFRA, BRANDS, NEARBY, SHOWROOM, CONSTRUCTION,
  SPRING_SOFT, SALES,
} from "./tokens";
import { Media, HeroLotus, SlideDecor, BrandFooter, CountUp, Particles, Heading, SlidePad } from "./ui";
import { tick } from "./feedback";

// ── 1. HERO ──────────────────────────────────────────────────────────────────
function SlideHero({ reduced }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <motion.div style={{ position: "absolute", inset: 0 }}
        initial={reduced ? {} : { scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 9, ease: "easeOut" }}>
        {/* IMG: hero байгалийн дэвсгэр (drone/lifestyle render) */}
        <Media src={A.hero} grad={["#7c9a6b", "#3f5b46", "#22332a"]} reduced={reduced} />
      </motion.div>
      <div style={{ position: "absolute", inset: 0,
        background: "linear-gradient(120deg, rgba(46,125,50,0.78) 0%, rgba(33,55,42,0.55) 45%, rgba(33,33,33,0.4) 100%)" }} />
      <HeroLotus />
      <Particles count={20} reduced={reduced} />

      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "0 7vw", color: "#fff" }}>
        <img src={A.logo} alt="Mandala Garden"
          style={{ width: "clamp(96px,9vw,150px)", height: "auto", marginBottom: 28, filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.35))" }} />
        <p style={{ fontFamily: FONT_ACCENT, fontStyle: "italic", fontSize: "clamp(22px,2vw,38px)", color: SAND, margin: "0 0 14px" }}>
          Байгальтай зохицсон амьдрах орчин
        </p>
        <h1 style={{ fontFamily: FONT_HEAD, fontSize: "clamp(40px,4.4vw,76px)", fontWeight: 700, lineHeight: 1.06, margin: 0, maxWidth: 880 }}>
          Гэр бүлдээ үлдээх <span style={{ color: MUSTARD }}>үнэ цэнтэй</span> хөрөнгө оруулалт
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 24, fontSize: "clamp(16px,1.3vw,22px)", color: "rgba(255,255,255,0.85)" }}>
          <span style={{ fontWeight: 700, color: MUSTARD, fontFamily: FONT_BRAND, letterSpacing: "0.08em" }}>AWT</span>
          Animal · Water · Tree · Яармаг–Арцатын хөндий · 15 га · 24 блок
        </div>
      </div>
    </div>
  );
}

// ── 2. STATS ─────────────────────────────────────────────────────────────────
function SlideStats({ reduced }) {
  return (
    <SlidePad>
      <SlideDecor reduced={reduced} />
      <Heading kicker="Төслийн тоо баримт" reduced={reduced}>Цар хүрээгээ тоогоор</Heading>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${STATS.length},1fr)`, gap: "clamp(18px,2vw,38px)",
        flex: 1, alignContent: "center", position: "relative" }}>
        {STATS.map((st, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: reduced ? 0 : 26 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 * i }} style={{ borderTop: `3px solid ${st.c}`, paddingTop: 22 }}>
            <div style={{ fontFamily: FONT_BRAND, fontSize: "clamp(48px,5.4vw,100px)", fontWeight: 900, lineHeight: 1, color: CHARCOAL, letterSpacing: "-0.02em" }}>
              <CountUp target={st.n} suffix={st.s} reduced={reduced} />
            </div>
            <div style={{ marginTop: 14, fontSize: "clamp(16px,1.2vw,22px)", color: "#555", lineHeight: 1.35 }}>{st.label}</div>
          </motion.div>
        ))}
      </div>
    </SlidePad>
  );
}

// Ил тод padding wrapper — ард нь shader background урсаж харагдана.
function GlassPad({ children }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "transparent",
      padding: "clamp(64px,8vh,96px) 7vw clamp(56px,7vh,96px)", display: "flex", flexDirection: "column", fontFamily: FONT_BODY }}>
      {children}
      <BrandFooter />
    </div>
  );
}

// ── 4. БАРИЛГЫН ЯВЦ (construction progress, ард shader) ──────────────────────
// Зургуудыг /assets/toim/ folder-аас (API) дуудна. Folder-т зураг хийхэд л харагдана.
// Файлын нэр "2025.03 …" хэлбэртэй бол огноо/тайлбар badge гарч ирнэ; үгүй бол зүгээр зураг.
// ApeChain маягийн 3D coverflow — голын карт том, хажуугийнх rotateY-ээр ар тал руу эргэнэ.
function coverOffset(index, current, total) {
  const raw = index - current;
  const half = total / 2;
  if (raw > half) return raw - total;
  if (raw < -half) return raw + total;
  return raw;
}

function coverPose(offset) {
  const side = Math.sign(offset);
  const dist = Math.abs(offset);
  if (offset === 0) {
    return { x: "0%", rotateY: -7, z: 0, scale: 1, opacity: 1, zIndex: 40, filter: "brightness(1)" };
  }
  if (dist > 2) {
    return { x: `${side * 118}%`, rotateY: -side * 52, z: -560, scale: 0.62, opacity: 0, zIndex: 10, filter: "brightness(0.3)" };
  }
  const x = dist === 1 ? side * 58 : side * 96;
  const rotY = -side * (dist === 1 ? 42 : 50);
  const z = dist === 1 ? -210 : -400;
  const scale = dist === 1 ? 0.85 : 0.72;
  const bright = dist === 1 ? 0.55 : 0.38;
  return { x: `${x}%`, rotateY: rotY, z, scale, opacity: 1, zIndex: 40 - dist, filter: `brightness(${bright})` };
}

function SlideConstruction({ reduced }) {
  const [items, setItems] = useState(CONSTRUCTION); // эхлэл/fallback
  const [i, setI] = useState(CONSTRUCTION.length - 1);

  useEffect(() => {
    let alive = true;
    fetch("/api/toim").then((r) => r.json()).then((d) => {
      if (alive && d.items?.length) { setItems(d.items); setI(d.items.length - 1); }
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const total = items.length || 1;
  const go = (step) => { tick(); setI((v) => (v + step + total) % total); };

  // зөөлөн авто-эргэлт — гар хүрэх/солих бүрт дахин эхэлнэ (5с)
  useEffect(() => {
    if (reduced || total <= 1) return;
    const t = setTimeout(() => setI((v) => (v + 1) % total), 5000);
    return () => clearTimeout(t);
  }, [i, total, reduced]);

  const navBtn = {
    width: "clamp(56px,4.4vw,72px)", height: "clamp(56px,4.4vw,72px)", borderRadius: "50%",
    border: "2px solid transparent", cursor: "pointer", display: "grid", placeItems: "center",
    color: "#fff", fontSize: "clamp(22px,1.8vw,30px)", lineHeight: 1,
    background: "linear-gradient(#0c2018,#0c2018) padding-box, linear-gradient(135deg," + MUSTARD + "," + BLUE + "," + GREEN + ") border-box",
    boxShadow: "0 10px 30px rgba(0,0,0,0.28)",
  };

  return (
    <GlassPad>
      {/* дэвсгэр — cream + топографик цагираган шугам (ApeChain contour vibe) */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(circle at 50% 8%, rgba(255,255,255,0.8), transparent 40%), linear-gradient(135deg, #e9f3ed 0%, #f6f3e7 48%, #dcebe1 100%)" }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.5,
        background:
          "repeating-radial-gradient(circle at 12% 86%, transparent 0 46px, rgba(66,149,71,0.07) 46px 48px)," +
          "repeating-radial-gradient(circle at 90% 14%, transparent 0 52px, rgba(0,157,222,0.06) 52px 54px)" }} />
      <SlideDecor reduced tone="light" />
      <Heading kicker="Барилгын явц" kickerColor={MUSTARD} reduced={reduced}>Ажлын явцын тойм</Heading>

      {/* 3D coverflow тайз */}
      <div style={{ flex: 1, minHeight: 0, position: "relative", margin: "-2vh -7vw 0" }}>
        <motion.div
          drag={reduced ? false : "x"}
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          dragMomentum={false}
          onDragEnd={(_e, info) => {
            const power = info.offset.x + info.velocity.x * 0.22;
            if (power < -70) go(1);
            else if (power > 70) go(-1);
          }}
          style={{ position: "absolute", inset: 0, touchAction: "pan-y" }}>
          {items.map((c, k) => {
            const offset = coverOffset(k, i, total);
            const pose = coverPose(offset);
            const isActive = offset === 0;
            return (
              <motion.button key={c.src || k} onClick={() => setI(k)}
                aria-label={c.label || c.date || `Зураг ${k + 1}`}
                whileTap={isActive ? { scale: 0.99 } : {}}
                animate={reduced
                  ? { x: pose.x, rotateY: 0, z: 0, scale: isActive ? 1 : 0.8, opacity: Math.abs(offset) > 1 ? 0 : 1, zIndex: pose.zIndex, filter: pose.filter }
                  : pose}
                transition={SPRING_SOFT}
                style={{ position: "absolute", inset: 0, margin: "auto",
                  width: "min(48vw,880px)", height: "min(54vh,560px)",
                  transformPerspective: 1500, transformOrigin: "center center",
                  zIndex: pose.zIndex, padding: 0, border: "none", cursor: "pointer",
                  borderRadius: 22, overflow: "hidden", background: "#0c1410",
                  boxShadow: isActive ? "0 40px 110px rgba(0,0,0,0.42)" : "0 24px 64px rgba(0,0,0,0.3)",
                  outline: "1px solid rgba(255,255,255,0.08)" }}>
                <Media src={c.src} grad={c.grad} fit="cover" reduced={reduced} />
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: isActive
                  ? "linear-gradient(to top, rgba(8,16,11,0.82) 0%, rgba(8,16,11,0.18) 40%, transparent 68%)"
                  : "rgba(4,8,6,0.32)" }} />
                {/* идэвхтэй карт дээр л date + label overlay (ApeChain маягаар доод-зүүн) */}
                {isActive && (c.date || c.label) && (
                  <div style={{ position: "absolute", left: "clamp(24px,2.4vw,40px)", right: 24, bottom: "clamp(24px,3vh,40px)",
                    textAlign: "left", color: "#fff" }}>
                    {c.date && (
                      <span style={{ display: "inline-block", background: MUSTARD, color: CHARCOAL,
                        padding: "8px 18px", borderRadius: 30, fontFamily: FONT_BRAND, fontWeight: 900,
                        fontSize: "clamp(15px,1.25vw,24px)", marginBottom: 14, letterSpacing: "0.02em" }}>{c.date}</span>
                    )}
                    {c.label && (
                      <div style={{ fontFamily: FONT_HEAD, fontSize: "clamp(28px,3.4vw,60px)", fontWeight: 800,
                        lineHeight: 1.02, textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>{c.label}</div>
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* stacked дугуй nav товч — баруун ирмэг (ApeChain маягаар) */}
        <div style={{ position: "absolute", right: "2.5vw", top: "50%", transform: "translateY(-50%)", zIndex: 60,
          display: "flex", flexDirection: "column", gap: 16 }}>
          <button onClick={() => go(1)} aria-label="Дараагийн зураг" style={navBtn}>›</button>
          <button onClick={() => go(-1)} aria-label="Өмнөх зураг" style={navBtn}>‹</button>
        </div>
      </div>

      {/* thumbnail зурвас — доор (огноо байвал огноо, үгүй бол дугаар) */}
      <div style={{ display: "flex", gap: 12, marginTop: 14, justifyContent: "center", alignItems: "center", flexWrap: "nowrap", overflow: "hidden" }}>
        {items.map((c, k) => (
          <motion.button key={c.src || k} onClick={() => setI(k)} whileTap={{ scale: 0.94 }}
            aria-label={c.date || `Зураг ${k + 1}`}
            animate={{ opacity: k === i ? 1 : 0.55 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", border: "none", background: "transparent", flex: "0 0 auto" }}>
            <div style={{ width: "clamp(96px,7vw,140px)", aspectRatio: "16/9", borderRadius: 10, overflow: "hidden",
              border: k === i ? `3px solid ${MUSTARD}` : "2px solid rgba(0,0,0,0.12)",
              boxShadow: k === i ? "0 6px 18px rgba(0,0,0,0.2)" : "none", transition: "border 0.25s" }}>
              <Media src={c.src} grad={c.grad} fit="cover" reduced={reduced} />
            </div>
            <span style={{ fontSize: "clamp(12px,0.9vw,16px)", fontWeight: 700, color: k === i ? CHARCOAL : "#9aa39c" }}>{c.date || `${k + 1}`}</span>
          </motion.button>
        ))}
      </div>
    </GlassPad>
  );
}

// ── 5. MASTER PLAN — ТОМ 3D render (бүх мэдээлэл зураг дотроо) ────────────────
// Зургийг бараг бүтэн дэлгэцэд харуулна. Tap → бүтэн дэлгэцийн zoom.
function SlideMasterPlan({ reduced }) {
  const [zoom, setZoom] = useState(false);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: OFFWHITE, display: "flex", flexDirection: "column",
      padding: "clamp(36px,4.5vh,60px) clamp(32px,3vw,64px) clamp(16px,2.5vh,32px)", fontFamily: FONT_BODY }}>
      <SlideDecor reduced={reduced} />
      <Heading kicker="Ерөнхий төлөвлөгөө · Нийт 24 блок" reduced={reduced}>Нэгдсэн төлөвлөлт</Heading>

      {/* ТОМ зураг — үлдсэн орон зайг бүтэн дүүргэнэ, tap → fullscreen */}
      <motion.button onClick={() => setZoom(true)} whileTap={{ scale: 0.995 }}
        style={{ flex: 1, minHeight: 0, width: "100%", position: "relative", border: "none", background: "transparent",
          cursor: "pointer", padding: 0, borderRadius: 16, overflow: "hidden" }}>
        {/* IMG: Нэгдсэн төлөвлөлт 3D render (All edited.jpg) */}
        <Media src={A.masterPlan} grad={["#9aa3b0", "#5a6a7e"]} fit="contain" bg={OFFWHITE} reduced={reduced} />
        <span style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.55)", color: "#fff",
          padding: "8px 16px", borderRadius: 12, fontSize: "clamp(13px,1vw,18px)", backdropFilter: "blur(4px)" }}>🔍 томруулах</span>
      </motion.button>

      <p style={{ fontSize: "clamp(12px,0.85vw,15px)", color: "#999", margin: "8px 0 0", textAlign: "center" }}>{BLOCK_NOTE}</p>

      {/* fullscreen zoom */}
      <AnimatePresence>
        {zoom && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoom(false)}
            style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(18,22,18,0.96)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.97 }} transition={{ duration: 0.3 }} style={{ width: "100%", height: "100%" }}>
              <Media src={A.masterPlan} grad={["#9aa3b0", "#5a6a7e"]} fit="contain" bg="transparent" reduced={reduced} />
            </motion.div>
            <button onClick={() => setZoom(false)} style={{ position: "fixed", top: 26, right: 26, width: 64, height: 64, borderRadius: "50%",
              border: "none", background: GREEN, color: "#fff", fontSize: 32, fontWeight: 700, cursor: "pointer" }}>×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── 6. ОРОН СУУЦ — Айл бүрийн давхрын хуваалт (жинхэнэ зургийг ТОМ харуулна) ──
// Зураг бүр өөртөө талбай + өрөөний задаргааг агуулсан мэргэжлийн plan. Зүүн талд
// ТОМ зураг, баруун талд бусад айлын thumbnail (ДЭЭШ/ДООШ swipe). Tap → бүтэн дэлгэц.
function SlideUnits({ reduced }) {
  const blocks = BLOCKS.filter((b) => PLAN_COUNTS[b.name] > 0); // 201–205
  const [block, setBlock] = useState(blocks[0].name);
  const [idx, setIdx] = useState(0);
  const [box, setBox] = useState(false);
  const count = PLAN_COUNTS[block];
  const images = Array.from({ length: count }, (_, i) => plan(block, i + 1));
  const badge = (BLOCKS.find((b) => b.name === block) || {}).badge || GREEN;

  return (
    <SlidePad>
      <SlideDecor reduced={reduced} />
      <Heading kicker="Орон сууц · 2–4 өрөө · 47–126 м²" kickerColor={BLUE} reduced={reduced}>Айл бүрийн давхрын хуваалт</Heading>

      {/* блок сонголт */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
        {blocks.map((b) => {
          const on = b.name === block;
          return (
            <motion.button key={b.name} onClick={() => { setBlock(b.name); setIdx(0); }} whileTap={{ scale: 0.95 }}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, lineHeight: 1, whiteSpace: "nowrap",
                minHeight: 56, padding: "0 26px", borderRadius: 30, cursor: "pointer",
                border: on ? `2px solid ${b.badge}` : "2px solid #0001", background: on ? b.badge : "#fff",
                color: on ? "#fff" : CHARCOAL, fontFamily: FONT_BRAND, fontWeight: 900, fontSize: "clamp(17px,1.3vw,24px)" }}>
              {b.name}<span style={{ fontSize: "0.55em", fontWeight: 400, opacity: 0.85 }}>блок</span>
            </motion.button>
          );
        })}
        <div style={{ marginLeft: "auto", fontSize: "clamp(15px,1.1vw,20px)", color: "#555" }}>{count} айл · {idx + 1}/{count}</div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1fr clamp(150px,15vw,224px)",
        gridTemplateRows: "minmax(0, 1fr)", gap: "clamp(16px,1.8vw,28px)" }}>
        {/* ТОМ floor plan (зураг өөртөө талбай + өрөөний задаргааг агуулсан) */}
        <motion.button onClick={() => setBox(true)} whileTap={{ scale: 0.99 }}
          style={{ position: "relative", width: "100%", height: "100%", border: "1px solid #0001", background: "#fff", borderRadius: 18, overflow: "hidden",
            cursor: "pointer", padding: 0, minHeight: 0, boxShadow: "0 16px 50px rgba(0,0,0,0.10)" }}>
          <AnimatePresence mode="wait">
            <motion.div key={block + idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }} style={{ position: "absolute", inset: 0, padding: 8 }}>
              {/* IMG: айлын давхрын хуваалт зураг — /assets/<block> (n).png */}
              <Media src={images[idx]} grad={["#eef1f4", "#cfd6dd"]} fit="contain" bg="#fff" reduced={reduced} />
            </motion.div>
          </AnimatePresence>
          <span style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(0,0,0,0.55)", color: "#fff",
            padding: "8px 16px", borderRadius: 12, fontSize: "clamp(13px,1vw,18px)", backdropFilter: "blur(4px)" }}>🔍 томруулах</span>
        </motion.button>

        {/* айл thumbnail багана — ДЭЭШ/ДООШ swipe */}
        <div style={{ minHeight: 0, overflowY: "auto", touchAction: "pan-y", display: "flex", flexDirection: "column",
          gap: 12, paddingRight: 6, WebkitOverflowScrolling: "touch" }}>
          {images.map((src, i) => {
            const on = i === idx;
            return (
              <motion.button key={src} onClick={() => setIdx(i)} whileTap={{ scale: 0.96 }}
                style={{ position: "relative", width: "100%", aspectRatio: "1", flexShrink: 0, borderRadius: 12, overflow: "hidden",
                  cursor: "pointer", padding: 4, background: "#fff", border: on ? `3px solid ${badge}` : "2px solid #0001" }}>
                <Media src={src} grad={["#eef1f4", "#cfd6dd"]} fit="contain" bg="#fff" reduced={reduced} />
                <span style={{ position: "absolute", left: 8, bottom: 6, background: on ? badge : "rgba(0,0,0,0.5)", color: "#fff",
                  fontSize: 13, fontWeight: 700, padding: "2px 9px", borderRadius: 9 }}>{i + 1}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <Lightbox images={images} index={box ? idx : null} label={`${block} блок`} onClose={() => setBox(false)}
        onPrev={() => setIdx((v) => (v - 1 + count) % count)} onNext={() => setIdx((v) => (v + 1) % count)} reduced={reduced} />
    </SlidePad>
  );
}
function Lightbox({ images, index, label, onClose, onPrev, onNext, reduced }) {
  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(20,28,22,0.95)", display: "flex",
            flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 1100, marginBottom: 16 }}>
            <span style={{ color: "#fff", fontFamily: FONT_HEAD, fontSize: "clamp(22px,1.8vw,32px)", fontWeight: 700 }}>{label} · {index + 1}/{images.length}</span>
            <button onClick={onClose} style={{ width: 64, height: 64, borderRadius: "50%", border: "none", background: GREEN, color: "#fff", fontSize: 32, fontWeight: 700, cursor: "pointer" }}>×</button>
          </div>
          <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 24, width: "100%", maxWidth: 1100, flex: 1, minHeight: 0 }}>
            <Round onClick={onPrev}>‹</Round>
            <div style={{ flex: 1, height: "100%", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
              <AnimatePresence mode="wait">
                <motion.div key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ width: "100%", height: "100%" }}>
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

// ── 6. INFRASTRUCTURE ────────────────────────────────────────────────────────
function SlideInfra({ reduced }) {
  return (
    <SlidePad bg={DARK}>
      <SlideDecor reduced={reduced} tone="dark" />
      <Heading kicker="Инженерийн шийдэл" kickerColor={MUSTARD} light reduced={reduced}>Найдвартай дэд бүтэц</Heading>
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(24px,2.4vw,44px)" }}>
        {INFRA.map((it, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: reduced ? 0 : 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }} style={{ borderTop: `3px solid ${it.c}`, paddingTop: 24 }}>
            <div style={{ fontSize: "clamp(38px,3.2vw,58px)", marginBottom: 12 }}>{it.icon}</div>
            <div style={{ fontSize: "clamp(14px,1vw,19px)", color: it.c, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontWeight: 700 }}>{it.k}</div>
            <div style={{ fontFamily: FONT_HEAD, fontSize: "clamp(30px,2.6vw,46px)", fontWeight: 700, color: "#fff", marginBottom: 14 }}>{it.v}</div>
            <p style={{ fontSize: "clamp(16px,1.2vw,22px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.5, margin: 0 }}>{it.d}</p>
          </motion.div>
        ))}
      </div>
      <div style={{ position: "relative", marginTop: "min(5vh,48px)", paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.14)" }}>
        <p style={{ fontSize: "clamp(14px,1vw,19px)", color: "rgba(255,255,255,0.5)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20 }}>Материалын брэндүүд</p>
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

// ── 7. БАЙРШИЛ + ОРЧИН + ТАНИЛЦУУЛГА (нэгтгэсэн нэг хуудас) ───────────────────
function SlideLocation({ reduced }) {
  const gallery = [
    { src: A.renderFinal, cap: "Байршлын төлөвлөлт", grad: ["#9aa3b0", "#5a6a7e"] },
    ...SHOWROOM,
  ];
  const [i, setI] = useState(0);
  const [lb, setLb] = useState(null);     // { title, images }
  const [idx, setIdx] = useState(0);
  const [busy, setBusy] = useState(null);
  const count = lb?.images.length || 0;
  const openCard = async (a, k) => {
    setBusy(k);
    try {
      const r = await fetch(`/api/amenities/${a.dir}`);
      const d = await r.json();
      if (d.images?.length) { setIdx(0); setLb({ title: a.title, images: d.images }); }
    } catch { /* алгасах */ } finally { setBusy(null); }
  };

  return (
    <SlidePad>
      <SlideDecor reduced={reduced} />
      <Heading kicker="Байршил · Орчин · Танилцуулга" kickerColor={BLUE} reduced={reduced}>Хаана, ямар орчинд амьдрах вэ</Heading>
      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "clamp(18px,2vw,34px)" }}>
        {/* ЗҮҮН — танилцуулга / байршлын зураг карусель */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0, gap: 12 }}>
          <div style={{ position: "relative", flex: 1, minHeight: 0, borderRadius: 20, overflow: "hidden", background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.14)" }}>
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ position: "absolute", inset: 0 }}>
                <Media src={gallery[i].src} grad={gallery[i].grad} fit="cover" reduced={reduced} />
              </motion.div>
            </AnimatePresence>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "20px 24px", background: "linear-gradient(to top, rgba(15,20,15,0.72), transparent)", color: "#fff" }}>
              <div style={{ fontFamily: FONT_HEAD, fontSize: "clamp(19px,1.7vw,30px)", fontWeight: 700 }}>{gallery[i].cap}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, overflow: "hidden" }}>
            {gallery.map((g, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={g.cap}
                style={{ flex: "0 0 auto", width: "clamp(78px,5.6vw,116px)", aspectRatio: "4/3", borderRadius: 10, overflow: "hidden", cursor: "pointer", padding: 0, background: "#fff", border: k === i ? `3px solid ${GREEN}` : "2px solid #0001" }}>
                <Media src={g.src} grad={g.grad} fit="cover" reduced={reduced} />
              </button>
            ))}
          </div>
        </div>

        {/* БАРУУН — орчин (дарж зураг үзэх) + ойролцоо */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0, gap: "clamp(12px,1.8vh,20px)" }}>
          <div>
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: "clamp(16px,1.25vw,22px)", color: CHARCOAL, marginBottom: 8 }}>
              Орчин <span style={{ fontSize: "0.66em", color: "#999", fontWeight: 500 }}>· дарж зураг үзэх</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {AMENITIES.map((a, k) => (
                <button key={k} onClick={() => openCard(a, k)} aria-label={a.title}
                  style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderRadius: 11, cursor: "pointer", background: "#fff", border: `2px solid ${a.c}22`, textAlign: "left", opacity: busy === k ? 0.55 : 1 }}>
                  <span style={{ fontSize: "clamp(18px,1.4vw,24px)" }}>{a.icon}</span>
                  <span style={{ fontSize: "clamp(11px,0.9vw,15px)", fontWeight: 600, lineHeight: 1.15 }}>{a.title}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ minHeight: 0 }}>
            <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: "clamp(16px,1.25vw,22px)", color: CHARCOAL, marginBottom: 8 }}>Ойролцоо</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {NEARBY.map((p, k) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderRadius: 11, background: "#fff", border: "1px solid #0001" }}>
                  <span style={{ fontSize: "clamp(16px,1.3vw,22px)" }}>{p.icon}</span>
                  <span style={{ fontSize: "clamp(11px,0.85vw,14px)", lineHeight: 1.15 }}>{p.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Lightbox images={lb?.images || []} index={lb ? idx : null} label={lb?.title}
        onClose={() => setLb(null)}
        onPrev={() => setIdx((v) => (v - 1 + count) % count)}
        onNext={() => setIdx((v) => (v + 1) % count)} reduced={reduced} />
    </SlidePad>
  );
}

// ── 10. БОРЛУУЛАЛТЫН МЕНЕЖЕРҮҮД (төгсгөлийн CTA — утсаар холбогдох) ───────────
// Зураг: /assets/salers/ · утас: tokens.js → SALES (хүн бүрээр засна).
function SlideSales({ reduced }) {
  return (
    <SlidePad>
      <SlideDecor reduced={reduced} />
      <Heading kicker="Холбоо барих" kickerColor={MUSTARD} reduced={reduced}>Борлуулалтын менежерүүд</Heading>
      <p style={{ textAlign: "center", maxWidth: 980, margin: "0 auto clamp(18px,2.6vh,38px)",
        fontSize: "clamp(15px,1.15vw,21px)", color: "#666", lineHeight: 1.4 }}>
        Манай борлуулалтын менежерүүдтэй утсаар шууд холбогдон төслийн талаар дэлгэрэнгүй мэдээлэл аваарай.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "clamp(16px,1.6vw,30px)",
        flex: 1, minHeight: 0, alignContent: "center" }}>
        {SALES.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: reduced ? 0 : 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 14px 44px rgba(0,0,0,0.09)", padding: "clamp(20px,2.6vh,36px) clamp(14px,1.4vw,24px)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(14px,1.8vh,22px)" }}>
            {/* зураг — брэнд өнгийн дугуй дэвсгэр дээр */}
            <div style={{ width: "clamp(120px,9vw,178px)", aspectRatio: "1", borderRadius: "50%",
              overflow: "hidden", background: m.c, flexShrink: 0 }}>
              <Media src={m.img} grad={[m.c, m.c]} bg={m.c} fit="cover" reduced={reduced} />
            </div>
            {/* нэр + албан тушаал */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: "clamp(17px,1.4vw,25px)",
                color: CHARCOAL, textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.1 }}>{m.name}</div>
              <div style={{ marginTop: 7, fontSize: "clamp(13px,1vw,17px)", color: "#8a8a8a", lineHeight: 1.3 }}>{m.role}</div>
            </div>
            {/* утасны дугаар (Холбогдох товчны оронд) */}
            <a href={`tel:${m.phone.replace(/[^0-9+]/g, "")}`}
              style={{ marginTop: "auto", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10,
                padding: "12px clamp(20px,1.6vw,30px)", borderRadius: 30, border: `2px solid ${MUSTARD}`,
                color: CHARCOAL, fontFamily: FONT_BRAND, fontWeight: 800, fontSize: "clamp(16px,1.2vw,23px)",
                letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
              <span aria-hidden="true">📞</span> {m.phone}
            </a>
          </motion.div>
        ))}
      </div>
    </SlidePad>
  );
}

// ── SLIDE бүртгэл (дараалал + indicator нэр + dark UI флаг) ───────────────────
export const SLIDES = [
  { name: "Нүүр",               dark: true,  Comp: SlideHero },
  { name: "Тоон үзүүлэлт",      dark: false, Comp: SlideStats },
  { name: "Орон сууц",          dark: false, Comp: SlideUnits },          // ← давхрын хуваалт, 3-р хуудас
  { name: "Барилгын явц",       dark: false, Comp: SlideConstruction },
  { name: "Ерөнхий төлөвлөгөө", dark: false, Comp: SlideMasterPlan },
  { name: "Дэд бүтэц",          dark: true,  Comp: SlideInfra },
  { name: "Байршил ба орчин",   dark: false, Comp: SlideLocation },        // ← Байршил + Орчин + Танилцуулга нэгтгэв
  { name: "Борлуулалтын баг",   dark: false, Comp: SlideSales },
];

