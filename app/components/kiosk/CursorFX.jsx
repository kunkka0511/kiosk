"use client";
// ============================================================================
//  CURSOR FX — хуруу дагах хүрэлт эффект (бүх слайд дээр)
//  • Pointing-hand SVG cursor (хуруу заах гар, peach + blue cuff)
//  • Хурдан spring-ээр хуруу дагана; дарахад шахагдах animation.
//  • Удаан бүдэг glow сүүл + усны долгио ripple ring.
//  • pointerEvents: none — swipe/tap-д саад болохгүй.
// ============================================================================
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const RIPPLE = "#009DDE";
const MAX = 8;
const LIFE = 900;
const GAP = 150;
let _id = 0;


export default function CursorFX({ reduced }) {
  const [ripples, setRipples] = useState([]);
  const [pressed, setPressed] = useState(false);
  const last = useRef(0);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const fx = useSpring(mx, { stiffness: 350, damping: 28 }); // хурдан цөм
  const fy = useSpring(my, { stiffness: 350, damping: 28 });
  const sx = useSpring(mx, { stiffness: 65, damping: 20 });  // удаан бүдэг сүүл
  const sy = useSpring(my, { stiffness: 65, damping: 20 });

  useEffect(() => {
    const spawn = (x, y) => {
      const id = ++_id;
      setRipples((r) => [...r.slice(-(MAX - 1)), { id, x, y }]);
      setTimeout(() => setRipples((r) => r.filter((it) => it.id !== id)), LIFE);
    };
    const move = (e) => {
      mx.set(e.clientX); my.set(e.clientY);
      const now = performance.now();
      if (!reduced && now - last.current > GAP) { last.current = now; spawn(e.clientX, e.clientY); }
    };
    const down = (e) => {
      mx.set(e.clientX); my.set(e.clientY);
      setPressed(true);
      spawn(e.clientX, e.clientY);
    };
    const up = () => setPressed(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [reduced, mx, my]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 95, pointerEvents: "none", overflow: "hidden" }}>
      {/* усны долгио */}
      {ripples.map((r) => (
        <motion.span key={r.id}
          initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: LIFE / 1000, ease: "easeOut" }}
          style={{ position: "absolute", left: r.x, top: r.y, width: 60, height: 60,
            marginLeft: -30, marginTop: -30, borderRadius: "50%",
            border: `2px solid ${RIPPLE}`, boxShadow: `0 0 16px ${RIPPLE}55` }} />
      ))}
      {/* удаан бүдэг сүүл */}
      {!reduced && (
        <motion.div style={{ position: "absolute", x: sx, y: sy, width: 84, height: 84,
          marginLeft: -42, marginTop: -42, borderRadius: "50%",
          background: `radial-gradient(circle, ${RIPPLE}22, transparent 70%)`, filter: "blur(3px)" }} />
      )}
      {/* хуруу заах гар cursor — /assets/cursor/left-click.png */}
      {!reduced && (
        <motion.div
          style={{
            position: "absolute", x: fx, y: fy,
            // finger tip нь зургийн дээд-зүүн буланд байгаа тул жижиг offset л хэрэгтэй
            marginLeft: -12, marginTop: -8,
          }}
          animate={{ scale: pressed ? 0.82 : 1 }}
          transition={{ scale: { type: "spring", stiffness: 400, damping: 20 } }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/cursor/left-click.png"
            alt=""
            width={56}
            height={56}
            style={{ display: "block", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}
          />
        </motion.div>
      )}
    </div>
  );
}
