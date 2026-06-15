"use client";
// ============================================================================
//  KIOSK ХАТУУЖИЛ — танхимын дэлгэцэд хэрэглэгч "эвдэх" боломжгүй болгоно.
//  • Right-click / контекст цэс хаах
//  • Pinch-zoom, gesture, давхар-tap zoom, Ctrl+wheel/Ctrl+± zoom хаах
//  • Зураг чирэх (drag) хаах
//  UI render хийхгүй — зөвхөн глобал хамгаалалт.
// ============================================================================
import { useEffect } from "react";

export default function KioskGuards() {
  useEffect(() => {
    const prevent = (e) => e.preventDefault();
    const noMultiTouch = (e) => { if (e.touches && e.touches.length > 1) e.preventDefault(); };
    let lastTouch = 0;
    const noDoubleTap = (e) => {
      const now = Date.now();
      if (now - lastTouch < 300) e.preventDefault();
      lastTouch = now;
    };
    const noWheelZoom = (e) => { if (e.ctrlKey) e.preventDefault(); };
    const noKeyZoom = (e) => {
      if ((e.ctrlKey || e.metaKey) && ["+", "-", "=", "0"].includes(e.key)) e.preventDefault();
    };

    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dragstart", prevent);
    document.addEventListener("gesturestart", prevent);
    document.addEventListener("gesturechange", prevent);
    document.addEventListener("gestureend", prevent);
    document.addEventListener("touchmove", noMultiTouch, { passive: false });
    document.addEventListener("touchend", noDoubleTap, { passive: false });
    window.addEventListener("wheel", noWheelZoom, { passive: false });
    window.addEventListener("keydown", noKeyZoom);

    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dragstart", prevent);
      document.removeEventListener("gesturestart", prevent);
      document.removeEventListener("gesturechange", prevent);
      document.removeEventListener("gestureend", prevent);
      document.removeEventListener("touchmove", noMultiTouch);
      document.removeEventListener("touchend", noDoubleTap);
      window.removeEventListener("wheel", noWheelZoom);
      window.removeEventListener("keydown", noKeyZoom);
    };
  }, []);

  return null;
}
