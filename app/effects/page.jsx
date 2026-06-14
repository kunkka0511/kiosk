"use client";

import RevealZoom from "../components/hover/RevealZoom";
import SplitSlide from "../components/hover/SplitSlide";
import ClipReveal from "../components/hover/ClipReveal";
import Tilt3D from "../components/hover/Tilt3D";
import DuotoneShift from "../components/hover/DuotoneShift";
import Curtain from "../components/hover/Curtain";
import MaskText from "../components/hover/MaskText";
import RippleLiquid from "../components/hover/RippleLiquid";
import "./effects.css";

/* IMG — placeholder photos. Swap these picsum URLs for real Mandala Garden imagery. */
const img = (seed) => `https://picsum.photos/seed/${seed}/800/1000`;

// Brand accents: Water blue, Forest green, Zoo orange.
const BLUE = "#0094D9";
const GREEN = "#2E7D32";
const ORANGE = "#F9A825";

export default function EffectsPage() {
  return (
    <main className="fx-page">
      <header className="fx-head">
        <h1>
          Hover Effects <span className="fx-accent">/ Collection</span>
        </h1>
        <p>
          React + Framer Motion. Хулгана аваачиж (эсвэл гар утсан дээр дарж)
          туршина уу. Component бүр reusable — <code>src · title · subtitle ·
          accent</code> props авна.
        </p>
      </header>

      <div className="fx-grid">
        <RevealZoom src={img("mandala-zoom")} title="Reveal Zoom" subtitle="Animal · Water · Tree" accent={BLUE} />
        <SplitSlide src={img("mandala-split")} title="Split Slide" subtitle="Forest Garden" accent={GREEN} />
        <ClipReveal src={img("mandala-clip")} title="Clip Reveal" subtitle="Water Garden" accent={BLUE} />
        <Tilt3D src={img("mandala-tilt")} title="Tilt 3D" subtitle="Zoo Garden" accent={ORANGE} />
        <DuotoneShift src={img("mandala-duo")} title="Duotone Shift" subtitle="Forest Garden" accent={GREEN} />
        <Curtain src={img("mandala-curtain")} title="Curtain" subtitle="Mandala Garden" accent={BLUE} />
        <MaskText src={img("mandala-mask")} title="GARDEN" subtitle="Mask Text" accent={ORANGE} />
        <RippleLiquid src={img("mandala-ripple")} title="Ripple / Liquid" subtitle="Water Garden" accent={BLUE} />
      </div>
    </main>
  );
}
