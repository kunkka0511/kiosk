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
  AMENITIES, INFRA, BRANDS, NEARBY, SHOWROOM, SHOWROOM_INTRO, CONSTRUCTION,
} from "./tokens";
import { Media, HeroLotus, SlideDecor, BrandFooter, CountUp, Particles, Heading, SlidePad } from "./ui";

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
          Animal · Water · Tree · Яармаг–Арцатын хөндий · 10 га · 24 блок
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

// ── 3. SHOWROOM / ТАНИЛЦУУЛГА (ард shader урсана) ────────────────────────────
function SlideShowroom({ reduced }) {
  const [i, setI] = useState(0);
  const item = SHOWROOM[i];
  return (
    <GlassPad>
      <SlideDecor reduced={reduced} />
      <Heading kicker="Танилцуулга" reduced={reduced}>Загвар орон сууц & концепц</Heading>
      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: "clamp(20px,2.4vw,40px)" }}>
        {/* том feature зураг */}
        <div style={{ position: "relative", borderRadius: 22, overflow: "hidden", background: "#fff", boxShadow: "0 24px 70px rgba(0,0,0,0.16)" }}>
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ position: "absolute", inset: 0 }}>
              {/* IMG: showroom / render зураг */}
              <Media src={item.src} grad={item.grad} fit="cover" reduced={reduced} />
            </motion.div>
          </AnimatePresence>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 30px",
            background: "linear-gradient(to top, rgba(15,20,15,0.78), transparent)", color: "#fff" }}>
            <div style={{ fontFamily: FONT_HEAD, fontSize: "clamp(22px,2vw,34px)", fontWeight: 700 }}>{item.cap}</div>
          </div>
        </div>
        {/* concept текст + thumbnails */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <p style={{ fontFamily: FONT_ACCENT, fontStyle: "italic", fontSize: "clamp(20px,1.7vw,30px)", color: GREEN, lineHeight: 1.4, margin: "0 0 8px" }}>
            “Гэр бүлдээ үлдээх үнэ цэнтэй хөрөнгө оруулалт”
          </p>
          <p style={{ fontSize: "clamp(16px,1.2vw,22px)", color: "#444", lineHeight: 1.55, margin: "0 0 auto" }}>{SHOWROOM_INTRO}</p>
          <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
            {SHOWROOM.map((s, k) => (
              <motion.button key={k} onClick={() => setI(k)} whileTap={{ scale: 0.95 }}
                style={{ position: "relative", width: "clamp(96px,7vw,130px)", aspectRatio: "4/3", borderRadius: 12, overflow: "hidden",
                  cursor: "pointer", padding: 0, background: "#fff", border: k === i ? `3px solid ${GREEN}` : "2px solid #0001" }}>
                <Media src={s.src} grad={s.grad} fit="cover" reduced={reduced} />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </GlassPad>
  );
}

// ── 4. БАРИЛГЫН ЯВЦ (construction progress, ард shader) ──────────────────────
// Зургуудыг /assets/toim/ folder-аас (API) дуудна. Folder-т зураг хийхэд л харагдана.
// Файлын нэр "2025.03 …" хэлбэртэй бол огноо/тайлбар badge гарч ирнэ; үгүй бол зүгээр зураг.
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

  const item = items[i] || items[0];
  return (
    <GlassPad>
      <SlideDecor reduced={reduced} />
      <Heading kicker="Барилгын явц" kickerColor={MUSTARD} reduced={reduced}>Ажлын явцын тойм</Heading>
      <div style={{ flex: 1, minHeight: 0, position: "relative", borderRadius: 22, overflow: "hidden", background: "#fff", boxShadow: "0 24px 70px rgba(0,0,0,0.16)" }}>
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={{ position: "absolute", inset: 0 }}>
            {/* IMG: /assets/toim/ доторх зураг */}
            <Media src={item.src} grad={item.grad} fit="cover" reduced={reduced} />
          </motion.div>
        </AnimatePresence>
        {/* огнооны badge — зөвхөн файлын нэр огноотой бол */}
        {item.date && (
          <div style={{ position: "absolute", top: 22, left: 22, background: MUSTARD, color: CHARCOAL, padding: "10px 20px",
            borderRadius: 30, fontFamily: FONT_BRAND, fontWeight: 900, fontSize: "clamp(18px,1.5vw,28px)" }}>{item.date}</div>
        )}
        {/* тайлбар — зөвхөн байвал */}
        {item.label && (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "26px 30px",
            background: "linear-gradient(to top, rgba(15,20,15,0.78), transparent)", color: "#fff" }}>
            <div style={{ fontFamily: FONT_HEAD, fontSize: "clamp(22px,2vw,34px)", fontWeight: 700 }}>{item.label}</div>
          </div>
        )}
      </div>
      {/* thumbnails — огноо байвал огноо, үгүй бол дугаар */}
      <div style={{ display: "flex", gap: 14, marginTop: 16, justifyContent: "center", flexWrap: "wrap" }}>
        {items.map((c, k) => (
          <motion.button key={c.src || k} onClick={() => setI(k)} whileTap={{ scale: 0.96 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer", border: "none", background: "transparent" }}>
            <div style={{ width: "clamp(120px,9vw,170px)", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden",
              border: k === i ? `3px solid ${MUSTARD}` : "2px solid #0002" }}>
              <Media src={c.src} grad={c.grad} fit="cover" reduced={reduced} />
            </div>
            <span style={{ fontSize: "clamp(13px,1vw,18px)", fontWeight: 700, color: k === i ? CHARCOAL : "#888" }}>{c.date || `${k + 1}`}</span>
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
  const blocks = BLOCKS.filter((b) => PLAN_COUNTS[b.name] > 0); // 202–205
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

// ── 5. AMENITIES ─────────────────────────────────────────────────────────────
// Card дээр дарахад /assets/amenities/<dir>/ доторх зургууд gallery (Lightbox)-оор
// гарч ирнэ — swipe/‹›-ээр гүйлгэж үзнэ. Зураггүй бол "удахгүй нэмэгдэнэ" гэнэ.
function SlideAmenities({ reduced }) {
  const [gallery, setGallery] = useState(null); // { title, images }
  const [idx, setIdx] = useState(0);
  const [busy, setBusy] = useState(null);       // ачаалж буй card-ийн индекс
  const [empty, setEmpty] = useState(null);     // зураггүй card-ийн индекс
  const count = gallery?.images.length || 0;

  const openCard = async (a, i) => {
    setEmpty(null);
    setBusy(i);
    try {
      const res = await fetch(`/api/amenities/${a.dir}`);
      const data = await res.json();
      if (data.images?.length) { setIdx(0); setGallery({ title: a.title, images: data.images }); }
      else setEmpty(i);
    } catch { setEmpty(i); }
    finally { setBusy(null); }
  };

  return (
    <SlidePad>
      <SlideDecor reduced={reduced} />
      <Heading kicker="Орчин · AWT амьдрал" reduced={reduced}>Амьдралыг бүрдүүлэх орчин</Heading>
      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gridAutoRows: "1fr", gap: "clamp(14px,1.4vw,24px)", alignContent: "center" }}>
        {AMENITIES.map((a, i) => {
          const loading = busy === i;
          const noimg = empty === i;
          return (
            <motion.button key={i} onClick={() => openCard(a, i)}
              initial={{ opacity: 0, y: reduced ? 0 : 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.06 * i }} whileTap={{ scale: 0.97 }}
              style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14,
                padding: "clamp(16px,2.2vh,32px) 14px", borderRadius: 20, cursor: "pointer",
                background: "#fff", color: CHARCOAL, border: `2px solid ${a.c}22` }}>
              <div style={{ width: "clamp(72px,5vw,104px)", height: "clamp(72px,5vw,104px)", borderRadius: "50%",
                background: a.c + "1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(34px,2.8vw,52px)" }}>{a.icon}</div>
              <div style={{ fontFamily: FONT_HEAD, fontSize: "clamp(16px,1.2vw,23px)", fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{a.title}</div>
              <div style={{ fontSize: "clamp(13px,0.95vw,18px)", textAlign: "center", color: "#777", lineHeight: 1.35 }}>{a.sub}</div>
              {/* "зураг үзэх" badge */}
              <span style={{ marginTop: 2, fontSize: "clamp(12px,0.85vw,15px)", fontWeight: 700, color: a.c, opacity: noimg ? 0 : 1 }}>
                {loading ? "Ачаалж байна…" : "📷 Зураг үзэх"}
              </span>
              {noimg && (
                <span style={{ fontSize: "clamp(12px,0.85vw,15px)", color: "#aaa" }}>Зураг удахгүй нэмэгдэнэ</span>
              )}
            </motion.button>
          );
        })}
      </div>

      <Lightbox images={gallery?.images || []} index={gallery ? idx : null} label={gallery?.title}
        onClose={() => setGallery(null)}
        onPrev={() => setIdx((v) => (v - 1 + count) % count)}
        onNext={() => setIdx((v) => (v + 1) % count)} reduced={reduced} />
    </SlidePad>
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

// ── 7. LOCATION + CONTACT ────────────────────────────────────────────────────
function SlideLocation({ reduced }) {
  return (
    <SlidePad>
      <SlideDecor reduced={reduced} />
      <Heading kicker="Байршил · Хан-Уул дүүрэг · 23-р хороо" kickerColor={BLUE} reduced={reduced}>Яармаг–Арцатын хөндий</Heading>
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 44, flex: 1, minHeight: 0 }}>
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
          {/* IMG: байршлын render / газрын зураг */}
          <Media src={A.renderFinal} grad={["#9aa3b0", "#5a6a7e"]} fit="contain" bg="#fff" reduced={reduced} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1, alignContent: "center" }}>
            {NEARBY.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: reduced ? 0 : 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: i * 0.05 }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "#fff", borderRadius: 14, border: "1px solid #0001" }}>
                <span style={{ fontSize: "clamp(24px,2vw,34px)" }}>{p.icon}</span>
                <span style={{ fontSize: "clamp(15px,1.15vw,21px)", fontWeight: 500, lineHeight: 1.25 }}>{p.t}</span>
              </motion.div>
            ))}
          </div>
          <div style={{ marginTop: 18, padding: "22px 26px", borderRadius: 18, background: GREEN, color: "#fff", display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "clamp(14px,1vw,18px)", opacity: 0.85, marginBottom: 4 }}>Холбоо барих · Загварын байр 09:00–18:00</div>
              <div style={{ fontFamily: FONT_BRAND, fontSize: "clamp(34px,3vw,56px)", fontWeight: 900, letterSpacing: "0.02em" }}>📞 7575-8000</div>
            </div>
            {/* QR: загварын байр / вэб холбоосын QR код тавих зай */}
            <div style={{ width: "clamp(96px,8vw,128px)", height: "clamp(96px,8vw,128px)", background: "#fff", borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 14, fontWeight: 600, textAlign: "center", flexShrink: 0 }}>QR<br />код</div>
          </div>
        </div>
      </div>
    </SlidePad>
  );
}

// ── SLIDE бүртгэл (дараалал + indicator нэр + dark UI флаг) ───────────────────
export const SLIDES = [
  { name: "Нүүр",               dark: true,  Comp: SlideHero },
  { name: "Тоон үзүүлэлт",      dark: false, Comp: SlideStats },
  { name: "Танилцуулга",        dark: false, Comp: SlideShowroom },
  { name: "Барилгын явц",       dark: false, Comp: SlideConstruction },
  { name: "Ерөнхий төлөвлөгөө", dark: false, Comp: SlideMasterPlan },
  { name: "Орон сууц",          dark: false, Comp: SlideUnits },
  { name: "Орчин",              dark: false, Comp: SlideAmenities },
  { name: "Дэд бүтэц",          dark: true,  Comp: SlideInfra },
  { name: "Байршил",            dark: false, Comp: SlideLocation },
];

