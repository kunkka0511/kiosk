"use client";
// ============================================================================
//  ХҮРЭЛТИЙН МИКРО-FEEDBACK — зөөлөн "tick" дуу (WebAudio) + чичиргээ (vibrate)
//  • Зөвхөн хэрэглэгчийн үйлдэл (tap/swipe) дээр дуудна — autoplay бодлогод нийцнэ.
//  • Asset шаардахгүй: дууг WebAudio-оор шууд үүсгэнэ.
// ============================================================================
let ctx = null;
let muted = false;

export function setMuted(v) { muted = v; }

export function tick(freq = 520, vol = 0.05) {
  if (muted || typeof window === "undefined") return;
  try {
    if (navigator.vibrate) navigator.vibrate(8);
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = ctx || new AC();
    if (ctx.state === "suspended") ctx.resume();
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(g); g.connect(ctx.destination);
    o.start(t); o.stop(t + 0.13);
  } catch { /* чимээгүй алгасах */ }
}
