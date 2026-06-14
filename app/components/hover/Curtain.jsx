"use client";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, useHoverActive } from "./_shared";
import "./hover.css";

/**
 * CURTAIN — a coloured curtain rises from the bottom to cover the image,
 * carrying the title up into view with it.
 */
export default function Curtain({ src, title, subtitle, accent = "#0094D9" }) {
  const reduce = useReducedMotion();
  const [active, bind] = useHoverActive();
  const t = { duration: reduce ? 0 : 0.55, ease: EASE };

  return (
    <div className="hx-card" {...bind}>
      <span className="hx-label">Curtain</span>

      <img className="hx-img" src={src} alt={title} draggable={false} /> {/* IMG */}

      <motion.div
        className="hx-overlay"
        style={{
          background: `linear-gradient(180deg, ${accent}, rgba(0,0,0,0.55))`,
          display: "flex",
          alignItems: "flex-end",
          padding: "22px",
        }}
        initial={false}
        animate={{ y: active && !reduce ? "0%" : "100%" }}
        transition={t}
      >
        <motion.div
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 14 }}
          transition={{ ...t, delay: active && !reduce ? 0.15 : 0 }}
        >
          <div className="hx-title">{title}</div>
          {subtitle && (
            <div className="hx-sub" style={{ color: "rgba(255,255,255,0.85)" }}>
              {subtitle}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
