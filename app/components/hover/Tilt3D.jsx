"use client";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { EASE, useHoverActive } from "./_shared";
import "./hover.css";

/**
 * TILT 3D — the card tilts in 3D toward the cursor (perspective) with a
 * moving specular glare. Tilt is disabled for reduced-motion users.
 */
export default function Tilt3D({ src, title, subtitle, accent = "#F9A825" }) {
  const reduce = useReducedMotion();
  const [active, bind] = useHoverActive();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [10, -10]), {
    stiffness: 220,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-12, 12]), {
    stiffness: 220,
    damping: 22,
  });
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.4), transparent 45%)`;

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const recenter = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div
      className="hx-card"
      {...bind}
      onPointerMove={reduce ? undefined : handleMove}
      onPointerLeave={(e) => {
        bind.onPointerLeave(e);
        recenter();
      }}
      style={{ perspective: 850 }}
    >
      <span className="hx-label">Tilt 3D</span>

      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <img className="hx-img" src={src} alt={title} draggable={false} /> {/* IMG */}

        {!reduce && (
          <motion.div
            className="hx-overlay"
            style={{ background: glare, opacity: active ? 1 : 0, transition: "opacity .4s" }}
          />
        )}

        <div className="hx-content" style={{ transform: "translateZ(45px)" }}>
          <div className="hx-title">{title}</div>
          {subtitle && (
            <div className="hx-sub" style={{ color: accent }}>
              {subtitle}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
