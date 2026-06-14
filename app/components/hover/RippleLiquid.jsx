"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, useHoverActive } from "./_shared";
import "./hover.css";

/**
 * RIPPLE / LIQUID — a coloured ripple blooms outward from the exact point
 * the cursor enters, while the image gives a subtle liquid swell.
 */
export default function RippleLiquid({ src, title, subtitle, accent = "#0094D9" }) {
  const reduce = useReducedMotion();
  const [active, bind] = useHoverActive();
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const t = { duration: reduce ? 0 : 0.6, ease: EASE };

  const capture = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <div
      className="hx-card"
      {...bind}
      onPointerEnter={(e) => {
        capture(e);
        bind.onPointerEnter(e);
      }}
      onPointerDown={(e) => {
        capture(e);
        bind.onPointerDown(e);
      }}
    >
      <span className="hx-label">Ripple / Liquid</span>

      <motion.img
        className="hx-img"
        src={src} /* IMG */
        alt={title}
        draggable={false}
        animate={{ scale: active && !reduce ? 1.06 : 1 }}
        transition={t}
      />

      <motion.div
        className="hx-overlay"
        style={{
          left: `${origin.x}%`,
          top: `${origin.y}%`,
          width: "260%",
          height: "260%",
          x: "-50%",
          y: "-50%",
          borderRadius: "50%",
          background: accent,
          mixBlendMode: "multiply",
          inset: "auto",
        }}
        initial={false}
        animate={{ scale: active && !reduce ? 1 : 0, opacity: active ? 0.85 : 0 }}
        transition={t}
      />

      <div className="hx-content">
        <motion.div animate={{ opacity: active ? 1 : 0, y: active ? 0 : 12 }} transition={t}>
          <div className="hx-title">{title}</div>
          {subtitle && <div className="hx-sub">{subtitle}</div>}
        </motion.div>
      </div>
    </div>
  );
}
