"use client";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, useHoverActive } from "./_shared";
import "./hover.css";

/**
 * REVEAL ZOOM — image scales up gently, dark overlay softens,
 * the title rises in from below.
 */
export default function RevealZoom({ src, title, subtitle, accent = "#0094D9" }) {
  const reduce = useReducedMotion();
  const [active, bind] = useHoverActive();
  const t = { duration: reduce ? 0 : 0.5, ease: EASE };

  return (
    <div className="hx-card" {...bind}>
      <span className="hx-label">Reveal Zoom</span>

      <motion.img
        className="hx-img"
        src={src} /* IMG */
        alt={title}
        draggable={false}
        animate={{ scale: active && !reduce ? 1.08 : 1 }}
        transition={t}
      />

      <motion.div
        className="hx-overlay"
        style={{
          background:
            "linear-gradient(to top, rgba(15,15,15,0.9), rgba(15,15,15,0.15) 55%, transparent)",
        }}
        animate={{ opacity: active ? 0.65 : 1 }}
        transition={t}
      />

      <div className="hx-content">
        <motion.div
          animate={{ y: active ? 0 : 16, opacity: active ? 1 : 0 }}
          transition={t}
        >
          <div className="hx-title">{title}</div>
          {subtitle && (
            <div className="hx-sub" style={{ color: accent }}>
              {subtitle}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
