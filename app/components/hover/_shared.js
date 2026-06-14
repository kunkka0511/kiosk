"use client";
import { useCallback, useState } from "react";

/** Awwwards-grade easing — used by every effect for a smooth, weighty feel. */
export const EASE = [0.22, 1, 0.36, 1];

/**
 * Hover/active state that also works on touch.
 *  - Mouse: pointerenter / pointerleave drive the state.
 *  - Touch: a tap toggles it on/off (fallback so effects are usable on mobile).
 * Returns [active, bindProps].
 */
export function useHoverActive() {
  const [active, setActive] = useState(false);

  const onPointerEnter = useCallback((e) => {
    if (e.pointerType !== "touch") setActive(true);
  }, []);
  const onPointerLeave = useCallback((e) => {
    if (e.pointerType !== "touch") setActive(false);
  }, []);
  const onPointerDown = useCallback((e) => {
    if (e.pointerType === "touch") setActive((v) => !v);
  }, []);

  return [active, { onPointerEnter, onPointerLeave, onPointerDown }];
}
