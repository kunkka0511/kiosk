"use client";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, useHoverActive } from "./_shared";
import "./hover.css";

/**
 * CLIP REVEAL — a brand-colour layer wipes across the image from left to
 * right (clip-path), "painting" it, then the title slides in.
 */
export default function ClipReveal({ src, title, subtitle, accent = "#0094D9" }) {
  const reduce = useReducedMotion();
  const [active, bind] = useHoverActive();
  const t = { duration: reduce ? 0 : 0.55, ease: EASE };

  return (
    <div className="hx-card" {...bind}>
      <span className="hx-label">Clip Reveal</span>

      <img className="hx-img" src={src} alt={title} draggable={false} /> {/* IMG */}

      <motion.div
        className="hx-overlay"
        style={{ background: accent, mixBlendMode: "multiply" }}
        initial={false}
        animate={{ clipPath: active ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
        transition={t}
      />

      <div className="hx-content">
        <motion.div
          animate={{ x: active ? 0 : -18, opacity: active ? 1 : 0 }}
          transition={{ ...t, delay: active && !reduce ? 0.12 : 0 }}
        >
          <div className="hx-title">{title}</div>
          {subtitle && <div className="hx-sub">{subtitle}</div>}
        </motion.div>
      </div>
    </div>
  );
}
