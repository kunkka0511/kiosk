"use client";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, useHoverActive } from "./_shared";
import "./hover.css";

/**
 * SPLIT SLIDE — the image splits into a top and bottom half that slide
 * apart, revealing the title in the gap between them.
 */
export default function SplitSlide({ src, title, subtitle, accent = "#2E7D32" }) {
  const reduce = useReducedMotion();
  const [active, bind] = useHoverActive();
  const t = { duration: reduce ? 0 : 0.55, ease: EASE };
  const open = active && !reduce;

  return (
    <div className="hx-card" {...bind}>
      <span className="hx-label">Split Slide</span>

      <motion.div
        className="hx-split-half"
        style={{ top: 0, backgroundImage: `url(${src})`, backgroundPosition: "center top" }} /* IMG */
        animate={{ y: open ? "-34%" : "0%" }}
        transition={t}
      />
      <motion.div
        className="hx-split-half"
        style={{ bottom: 0, backgroundImage: `url(${src})`, backgroundPosition: "center bottom" }} /* IMG */
        animate={{ y: open ? "34%" : "0%" }}
        transition={t}
      />

      <div className="hx-split-center">
        <motion.div
          style={{ textAlign: "center" }}
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.9 }}
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
