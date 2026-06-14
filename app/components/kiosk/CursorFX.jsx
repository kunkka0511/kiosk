"use client";
// ============================================================================
//  CURSOR FX — ГЛОБАЛ хуруу/cursor дагах усан тусгал (бүх слайд дээр)
//  • Бүх дэлгэц дээр хуруу дагаж 2 давхарга усан тусгал (хурдан цөм + бүдэг сүүл).
//  • Хүрэх / чирэх бүрт усны долгио тойрог тархаж бүдгэрнэ (ripple).
//  • pointerEvents: none — swipe болон tap-д огт саад болохгүй, зүгээр л дээгүүр хөвнө.
//  • window дээр өөрөө сонсдог тул аль ч слайд дээр автоматаар ажиллана.
//  ГҮЙЦЭТГЭЛ: ripple 900мс дотор цэвэрлэгдэнэ, зэрэг 8-аар хязгаарлав.
// ============================================================================
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const COLOR = "#4FC3F7"; // Sky Blue — брэндийн усны өнгө
const MAX = 8;
const LIFE = 900;
const GAP = 150;
let _id = 0;

export default function CursorFX({ reduced }) {
  const [ripples, setRipples] = useState([]);
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
    const down = (e) => { mx.set(e.clientX); my.set(e.clientY); spawn(e.clientX, e.clientY); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
    };
  }, [reduced, mx, my]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 55, pointerEvents: "none", overflow: "hidden" }}>
      {/* усны долгио */}
      {ripples.map((r) => (
        <motion.span key={r.id}
          initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: LIFE / 1000, ease: "easeOut" }}
          style={{ position: "absolute", left: r.x, top: r.y, width: 60, height: 60, marginLeft: -30, marginTop: -30,
            borderRadius: "50%", border: `2px solid ${COLOR}`, boxShadow: `0 0 16px ${COLOR}55` }} />
      ))}
      {/* удаан бүдэг сүүл */}
      {!reduced && (
        <motion.div style={{ position: "absolute", x: sx, y: sy, width: 84, height: 84, marginLeft: -42, marginTop: -42,
          borderRadius: "50%", background: `radial-gradient(circle, ${COLOR}33, transparent 70%)`, filter: "blur(3px)" }} />
      )}
      {/* хурдан гэрэлт цөм */}
      {!reduced && (
        <motion.div style={{ position: "absolute", x: fx, y: fy, width: 18, height: 18, marginLeft: -9, marginTop: -9,
          borderRadius: "50%", background: `radial-gradient(circle, #ffffffcc, ${COLOR}aa 60%, transparent 75%)` }} />
      )}
    </div>
  );
}
