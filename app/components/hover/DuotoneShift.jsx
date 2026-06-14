"use client";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, useHoverActive } from "./_shared";
import "./hover.css";

/**
 * DUOTONE SHIFT — at rest the image is a desaturated, brand-tinted duotone;
 * on hover it blooms into full colour.
 */
export default function DuotoneShift({ src, title, subtitle, accent = "#2E7D32" }) {
  const reduce = useReducedMotion();
  const [active, bind] = useHoverActive();
  const t = { duration: reduce ? 0 : 0.55, ease: EASE };

  return (
    <div className="hx-card" {...bind}>
      <span className="hx-label">Duotone Shift</span>

      <motion.img
        className="hx-img"
        src={src} /* IMG */
        alt={title}
        draggable={false}
        animate={{
          filter: active
            ? "grayscale(0) saturate(1.12) contrast(1)"
            : "grayscale(1) contrast(1.06)",
          scale: active && !reduce ? 1.04 : 1,
        }}
        transition={t}
      />

      {/* brand-colour tint that fades away as the photo gains colour */}
      <motion.div
        className="hx-overlay"
        style={{ background: accent, mixBlendMode: "color" }}
        animate={{ opacity: active ? 0 : 0.55 }}
        transition={t}
      />
      <div
        className="hx-overlay"
        style={{
          background:
            "linear-gradient(to top, rgba(15,15,15,0.85), transparent 50%)",
        }}
      />

      <div className="hx-content">
        <div className="hx-title">{title}</div>
        {subtitle && (
          <div className="hx-sub" style={{ color: accent }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
