"use client";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, useHoverActive } from "./_shared";
import "./hover.css";

/**
 * MASK TEXT — large title with the image showing *through* the letters
 * (background-clip: text). On hover the image drifts and the text scales.
 */
export default function MaskText({ src, title, subtitle, accent = "#F9A825" }) {
  const reduce = useReducedMotion();
  const [active, bind] = useHoverActive();
  const t = { duration: reduce ? 0 : 0.6, ease: EASE };

  return (
    <div
      className="hx-card"
      {...bind}
      style={{
        background: "#0e0e0e",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <span className="hx-label">Mask Text</span>

      <motion.div
        className="hx-mask-text"
        style={{ backgroundImage: `url(${src})` }} /* IMG */
        animate={{
          backgroundPositionX: active ? "100%" : "0%",
          scale: active && !reduce ? 1.05 : 1,
        }}
        transition={t}
      >
        {title}
      </motion.div>

      {subtitle && (
        <div
          className="hx-content"
          style={{ textAlign: "center", position: "relative", padding: "0 14px 22px" }}
        >
          <div className="hx-sub" style={{ color: accent }}>
            {subtitle}
          </div>
        </div>
      )}
    </div>
  );
}
