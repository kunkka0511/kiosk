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
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Keyboard, Navigation, Zoom } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/zoom";
import gallery from "./gallery.module.css";
import {
  GREEN, BLUE, MUSTARD, CHARCOAL, OFFWHITE, SAND, DARK,
  FONT_HEAD, FONT_BRAND, FONT_BODY, FONT_ACCENT,
  A, plan, PLAN_COUNTS, STATS, BLOCKS, BLOCK_NOTE,
  AMENITIES, INFRA, BRANDS, NEARBY, CONSTRUCTION,
  SPRING_SOFT, SALES,
} from "./tokens";
import { Media, HeroLotus, SlideDecor, BrandFooter, CountUp, Particles, Heading, SlidePad } from "./ui";
import { tick } from "./feedback";
import MobileQrCard from "./MobileQrCard";

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
function SlideConstruction({ reduced }) {
  const [items, setItems] = useState(CONSTRUCTION); // эхлэл/fallback
  const [i, setI] = useState(CONSTRUCTION.length - 1);
  const [mainSwiper, setMainSwiper] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/toim").then((r) => r.json()).then((d) => {
      if (alive && d.items?.length) { setItems(d.items); setI(d.items.length - 1); }
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

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

      <div className={gallery.shell} onPointerDown={(e) => e.stopPropagation()}>
        <Swiper key={`main-${items.length}`} className={gallery.main}
          modules={[Keyboard, Navigation, Zoom]} navigation keyboard={{ enabled: true }}
          zoom={{ maxRatio: 3 }} nested speed={420} initialSlide={Math.max(0, items.length - 1)}
          onSwiper={setMainSwiper}
          onSlideChange={(swiper) => { tick(); setI(swiper.activeIndex); }}>
          {items.map((c, k) => (
            <SwiperSlide key={c.src || k} className={gallery.mainSlide}>
              <div className="swiper-zoom-container">
                <img src={c.src} alt={c.label || c.date || `Барилгын явцын зураг ${k + 1}`} />
              </div>
              {(c.date || c.label) && (
                <div className={gallery.caption}>
                  {c.date && <span>{c.date}</span>}
                  {c.label && <strong>{c.label}</strong>}
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={gallery.meta}>
          <span>{i + 1} / {items.length}</span>
          <span>Зургийг чирж солино · Давхар товшиж томруулна</span>
        </div>

        <Swiper key={`thumbs-${items.length}`} className={gallery.thumbs}
          modules={[FreeMode]} freeMode watchSlidesProgress nested
          slidesPerView="auto" spaceBetween={12}>
          {items.map((c, k) => (
            <SwiperSlide key={c.src || k} onClick={() => mainSwiper?.slideTo(k)}
              className={`${gallery.thumbSlide} ${k === i ? gallery.thumbActive : ""}`}>
              <img src={c.src} alt="" aria-hidden="true" />
              <span>{c.date || `${k + 1}`}</span>
            </SwiperSlide>
          ))}
        </Swiper>
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
function InfraIcon({ type, color }) {
  if (type === "power") return (
    <svg aria-hidden="true" viewBox="0 0 48 48" style={{ width: 52, height: 52, display: "block", color }}>
      <path fill="currentColor" d="M27.8 3 9 27h12.2L18 45l21-27H26.5L27.8 3Z" />
    </svg>
  );
  if (type === "water") return (
    <svg aria-hidden="true" viewBox="0 0 48 48" style={{ width: 52, height: 52, display: "block", color }}>
      <path fill="currentColor" d="M24 3S10 20.3 10 30a14 14 0 0 0 28 0C38 20.3 24 3 24 3Zm0 35.5a8.5 8.5 0 0 1-8.5-8.5c0-1.4.6-3.2 1.6-5.1.4 6.3 4.1 10 10.9 11.3a8.4 8.4 0 0 1-4 2.3Z" />
    </svg>
  );
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" style={{ width: 52, height: 52, display: "block", color }}>
      <path fill="currentColor" d="M5 18c5.2 0 5.2-4 10.4-4s5.2 4 10.4 4 5.2-4 10.4-4c3.1 0 4.4 1.4 6.8 2.6v7.1c-2.4-1.2-3.7-2.6-6.8-2.6-5.2 0-5.2 4-10.4 4s-5.2-4-10.4-4S10.2 25.1 5 25.1V18Zm0 13c5.2 0 5.2-4 10.4-4s5.2 4 10.4 4 5.2-4 10.4-4c3.1 0 4.4 1.4 6.8 2.6v7.1c-2.4-1.2-3.7-2.6-6.8-2.6-5.2 0-5.2 4-10.4 4s-5.2-4-10.4-4S10.2 38.1 5 38.1V31Z" />
    </svg>
  );
}

function SlideInfra({ reduced }) {
  const [material, setMaterial] = useState(null);
  return (
    <SlidePad bg={DARK}>
      <SlideDecor reduced={reduced} tone="dark" />
      <Heading kicker="Инженерийн шийдэл" kickerColor={MUSTARD} light reduced={reduced}>Найдвартай дэд бүтэц</Heading>
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "clamp(24px,2.4vw,44px)" }}>
        {INFRA.map((it, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: reduced ? 0 : 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }} style={{ borderTop: `3px solid ${it.c}`, paddingTop: 24 }}>
            <div style={{ marginBottom: 12 }}><InfraIcon type={it.icon} color={it.c} /></div>
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
            <button key={i} type="button" disabled={!b.detail} onClick={() => b.detail && setMaterial(b)}
              aria-label={b.detail ? `${b.d} дэлгэрэнгүй үзэх` : undefined}
              style={{ padding: "13px 20px", border: `1px solid ${b.detail ? "rgba(254,178,10,0.58)" : "rgba(255,255,255,0.18)"}`,
                borderRadius: 12, background: b.detail ? "rgba(254,178,10,0.07)" : "transparent", textAlign: "left",
                cursor: b.detail ? "pointer" : "default", opacity: b.detail ? 1 : 0.68 }}>
              <div style={{ fontFamily: FONT_BODY, fontSize: "clamp(16px,1.2vw,22px)", fontWeight: 600, letterSpacing: "-0.01em", color: "#fff" }}>{b.k}</div>
              <div style={{ fontSize: "clamp(13px,0.95vw,17px)", color: MUSTARD, marginTop: 4 }}>{b.d}</div>
              {b.detail && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 5 }}>дарж дэлгэрэнгүй үзэх</div>}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {material && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMaterial(null)}
            style={{ position: "fixed", inset: 0, zIndex: 220, padding: "clamp(20px,3vw,48px)", background: "rgba(11,18,14,0.94)",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div initial={{ scale: 0.96, y: 18 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: "min(94vw,1500px)", height: "min(88vh,850px)", display: "flex", flexDirection: "column",
                background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 34px 100px rgba(0,0,0,0.48)" }}>
              <div style={{ minHeight: 72, padding: "12px 16px 12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
                borderBottom: "1px solid rgba(0,0,0,0.09)" }}>
                <div>
                  <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: "clamp(20px,1.7vw,30px)", color: CHARCOAL }}>{material.d}</div>
                  <div style={{ fontSize: "clamp(13px,1vw,17px)", color: "#777", marginTop: 2 }}>{material.k}</div>
                </div>
                <button type="button" onClick={() => setMaterial(null)} aria-label="Материалын дэлгэрэнгүйг хаах"
                  style={{ width: 52, height: 52, borderRadius: "50%", border: "none", background: CHARCOAL, color: "#fff",
                    fontSize: 28, cursor: "pointer" }}>×</button>
              </div>
              <div style={{ flex: 1, minHeight: 0, background: OFFWHITE }}>
                <Media src={material.detail} grad={["#f7f7f7", "#e9e9e9"]} fit="contain" bg={OFFWHITE} reduced={reduced} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SlidePad>
  );
}

// ── 7. БАЙРШИЛ + ОРЧИН + ТАНИЛЦУУЛГА (нэгтгэсэн нэг хуудас) ───────────────────
function SlideLocation({ reduced }) {
  const [progress, setProgress] = useState(CONSTRUCTION);
  const gallery = progress.map((item, index) => ({
    ...item,
    cap: item.label || item.date || `Барилгын явц ${index + 1}`,
  }));
  const [i, setI] = useState(0);
  const [lb, setLb] = useState(null);     // { title, images }
  const [idx, setIdx] = useState(0);
  const [busy, setBusy] = useState(null);
  const count = lb?.images.length || 0;
  useEffect(() => {
    let alive = true;
    fetch("/api/toim").then((r) => r.json()).then((data) => {
      if (alive && data.items?.length) setProgress(data.items);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

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
          <div style={{ display: "flex", gap: 10, overflowX: "auto", overflowY: "hidden", touchAction: "pan-x", paddingBottom: 4 }}>
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
                  <img src={a.iconSrc} alt="" aria-hidden="true"
                    style={{ width: "clamp(24px,1.8vw,32px)", height: "clamp(24px,1.8vw,32px)", objectFit: "contain", flexShrink: 0 }} />
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "clamp(10px,1vw,18px)",
        flex: 1, minHeight: 0, alignContent: "center" }}>
        {SALES.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: reduced ? 0 : 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            style={{ background: "#fff", borderRadius: 20, border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 14px 44px rgba(0,0,0,0.09)", padding: "clamp(20px,2.6vh,36px) clamp(14px,1.4vw,24px)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(14px,1.8vh,22px)" }}>
            {/* зураг — брэнд өнгийн дугуй дэвсгэр дээр */}
            <div style={{ width: "clamp(90px,7vw,150px)", aspectRatio: "1", borderRadius: "50%",
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
                padding: "10px clamp(12px,1vw,20px)", borderRadius: 30, border: `2px solid ${MUSTARD}`,
                color: CHARCOAL, fontFamily: FONT_BRAND, fontWeight: 800, fontSize: "clamp(14px,1vw,20px)",
                letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
              <span aria-hidden="true">📞</span> {m.phone}
            </a>
          </motion.div>
        ))}
        <MobileQrCard />
      </div>
    </SlidePad>
  );
}

// ── SLIDE бүртгэл (дараалал + indicator нэр + dark UI флаг) ───────────────────
export const SLIDES = [
  { name: "Нүүр",               dark: true,  Comp: SlideHero },
  { name: "Тоон үзүүлэлт",      dark: false, Comp: SlideStats },
  { name: "Орон сууц",          dark: false, Comp: SlideUnits },          // ← давхрын хуваалт, 3-р хуудас
  { name: "Ерөнхий төлөвлөгөө", dark: false, Comp: SlideMasterPlan },
  { name: "Дэд бүтэц",          dark: true,  Comp: SlideInfra },
  { name: "Байршил ба орчин",   dark: false, Comp: SlideLocation },        // ← Байршил + Орчин + Танилцуулга нэгтгэв
  { name: "Борлуулалтын баг",   dark: false, Comp: SlideSales },
];

