"use client";
// ============================================================================
//  SHADER BACKGROUND — Three.js WebGL (nirnor.jp хэв маяг)
//  Бүтэн дэлгэц дүүргэсэн нэг fragment shader бодит цагт тооцоологдож,
//  Off-White суурин дээр Green→Blue→Mustard брэнд өнгийг МАШ СУБТЛ урсгана.
//  Контентын ард (z-index доор) амьд агаар үүсгэх зорилготой — зураг гол.
//
//  • Noise: Ashima simplex (snoise) + fBM давхаргалж органик урсах хээ.
//  • u_mouse — cursor/хуруу хөдлөхөд shader зөөлөн гажиж урсгал татагдана.
//  • prefers-reduced-motion бол статик CSS gradient (WebGL ажиллуулахгүй).
//  • Гүйцэтгэл: pixelRatio ≤1.5, ~30 FPS cap, идэвхгүй үед FPS бууруулна,
//    таб нуугдсан үед зогсооно.
// ============================================================================
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GREEN, BLUE, MUSTARD, OFFWHITE } from "./tokens";
import { useReducedMotion } from "./ui";

// ── Vertex: full-screen plane-ийг шууд clip-space-д байрлуулна ───────────────
const VERT = /* glsl */ `
  void main() { gl_Position = vec4(position, 1.0); }
`;

// ── Fragment: simplex noise + fBM + брэнд өнгөний субтл blend ────────────────
const FRAG = /* glsl */ `
  precision highp float;
  uniform float u_time;
  uniform vec2  u_mouse;       // 0..1 (хулганы байрлал)
  uniform vec2  u_resolution;
  uniform vec3  u_white;       // Off-White суурь
  uniform vec3  u_colorA;      // Green
  uniform vec3  u_colorB;      // Blue
  uniform vec3  u_colorC;      // Mustard
  uniform float u_intensity;   // өнгөний субтл эрчим

  // — Ashima simplex noise 2D (MIT) —
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                              + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // — fBM: noise-ийг давхаргалж органик урсах хээ —
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for(int i = 0; i < 5; i++){ v += a * snoise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p  = uv;
    p.x *= u_resolution.x / u_resolution.y;  // aspect засвар

    float t = u_time * 0.05;                  // тайван удаан урсгал
    vec2  m = (u_mouse - 0.5) * 0.6;          // хулганы нөлөө

    // domain warp — урсгалыг органик болгоно
    vec2 q = vec2(fbm(p * 1.5 + t + m), fbm(p * 1.5 - t + m + 4.2));
    float n = fbm(p * 1.8 + q * 1.2 + t);
    n = n * 0.5 + 0.5;                         // 0..1

    // Off-White суурин дээр брэнд өнгийг субтл blend
    vec3 col = u_white;
    col = mix(col, u_colorA, smoothstep(0.20, 0.75, n)             * u_intensity);
    col = mix(col, u_colorB, smoothstep(0.30, 0.95, q.x*0.5+0.5)   * u_intensity);
    col = mix(col, u_colorC, smoothstep(0.55, 1.00, q.y*0.5+0.5)   * u_intensity * 0.8);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function hexToVec3(hex) {
  const c = new THREE.Color(hex);
  return new THREE.Vector3(c.r, c.g, c.b);
}

export default function ShaderBackground({ intensity = 0.16 }) {
  const reduced = useReducedMotion();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (reduced) return; // статик gradient (доорх CSS), WebGL ажиллуулахгүй
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "low-power" });
    } catch {
      return; // WebGL дэмжээгүй бол чимээгүй унт
    }
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_white: { value: hexToVec3(OFFWHITE) },
      u_colorA: { value: hexToVec3(GREEN) },
      u_colorB: { value: hexToVec3(BLUE) },
      u_colorC: { value: hexToVec3(MUSTARD) },
      u_intensity: { value: intensity },
    };
    const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.u_resolution.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
    };
    resize();
    window.addEventListener("resize", resize);

    // хулганы байрлал (зөөлөн lerp хийнэ)
    const target = new THREE.Vector2(0.5, 0.5);
    let lastActive = performance.now();
    const onMove = (e) => {
      target.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
      lastActive = performance.now();
    };
    window.addEventListener("pointermove", onMove);

    // FPS cap (≈30) + идэвхгүй үед бууруулах (≈12) + таб нуугдвал зогсоох
    let raf, last = 0, paused = false;
    const onVis = () => { paused = document.hidden; if (!paused) { last = 0; loop(performance.now()); } };
    document.addEventListener("visibilitychange", onVis);

    const loop = (now) => {
      if (paused) return;
      raf = requestAnimationFrame(loop);
      const idle = now - lastActive > 4000;     // 4с хүрэлцэхгүй бол идэвхгүй
      const minDelta = idle ? 1000 / 12 : 1000 / 30;
      if (now - last < minDelta) return;
      last = now;
      uniforms.u_time.value = now * 0.001;
      uniforms.u_mouse.value.lerp(target, 0.05);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [reduced, intensity]);

  // reduced-motion: статик субтл gradient (WebGL биш)
  if (reduced) {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 0,
        background: `linear-gradient(135deg, ${OFFWHITE} 0%, #eef3ee 45%, #eaf2f6 70%, #f6efe0 100%)` }} />
    );
  }
  return (
    <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, width: "100%", height: "100%", display: "block" }} />
  );
}
