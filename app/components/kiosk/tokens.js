// ============================================================================
//  MANDALA GARDEN — KIOSK ТОКЕН & ДАТА
//  Албан ёсны брэнд (brand research) дээр үндэслэв. Энд зөвхөн тогтмол утга,
//  өнгө, фонт, агуулгын дата байна — UI код байхгүй.
// ============================================================================

// ── Албан ёсны палитр (mandala-garden-brand.skill дагуу — ЯГ ЭДГЭЭР hex) ──────
//  3 дэд брэнд: Zoo (шар) · Water (цэнхэр) · Forest (ногоон). 60-30-10 дүрэм.
export const GREEN    = "#429547"; // Forest Garden — ногоон (гол accent, CTA)
export const BLUE     = "#009DDE"; // Water Garden — цэнхэр
export const MUSTARD  = "#FEB20A"; // Zoo Garden — шар (highlight/уриа, CTA pill)
export const CHARCOAL = "#4A4A4A"; // брэндийн ink — гарчиг/текст (дулаан саарал)
export const OFFWHITE = "#FEFBF6"; // cream — 60% давамгай дэвсгэр
export const SAND     = "#F3E5AB"; // зөөлөн дулаан accent
export const DARK     = "#212121"; // гүн дэвсгэр (dark slide)
// ── Гүн/баялаг хувилбар (10% accent) ─────────────────────────────────────────
export const GREEN_DEEP = "#147317"; // Forest deep
export const BLUE_DEEP  = "#0057B8"; // Water deep
export const ZOO_DEEP   = "#DE794D"; // Zoo terracotta

// ── Фонт ────────────────────────────────────────────────────────────────────
export const FONT_HEAD   = "'Mogul Magistral','Samsung Sharp Sans', var(--font-inter), sans-serif";
export const FONT_BRAND  = "'Gilroy','Samsung Sharp Sans', var(--font-inter), sans-serif";
export const FONT_BODY   = "var(--font-inter), system-ui, sans-serif";
export const FONT_ACCENT = "var(--font-playfair), Georgia, serif"; // дэгжин serif — уриа

// ── Kiosk хугацаа (мс) ──────────────────────────────────────────────────────
export const IDLE_ATTRACT_MS = 60000; // 60с хүрэлцэхгүй бол attract горим
export const IDLE_RESET_MS   = 90000; // 90с хүрэлцэхгүй бол slide 1 рүү
export const ATTRACT_STEP_MS = 7000;  // attract үед slide солих хурд

// ── Медиа замууд (/public/assets) ───────────────────────────────────────────
// /* IMG */ = жинхэнэ drone/render/floor plan-аар солих боломжтой байрлал.
export const A = {
  logo:       "/assets/logo/mandala-garden-logo.png",
  hero:       "/assets/images/fbouz.jpg",            /* IMG hero дэвсгэр */
  masterPlan: encodeURI("/assets/All edited.jpg"),   /* IMG ерөнхий төлөвлөгөө */
  renderFinal:"/assets/images/final.png",            /* IMG байршил render */
  awt:        "/assets/images/awt.png",
  // AWT showcase видео/зураг
  water:      "/assets/video/pathway-evening.mp4",   /* IMG/VIDEO ус */
  tree:       "/assets/video/zoo-garden-clean.mp4",  /* IMG/VIDEO ногоон байгууламж */
  animal:     "/assets/video/animal-park.mp4",       /* IMG/VIDEO амьд орчин */
  res1:       "/assets/images/residences/1uruu.jpg",
  res2:       "/assets/images/residences/2uruu.jpg",
  res3:       "/assets/images/residences/3uruu.jpg",
};
// Блокийн давхрын хуваалт: /assets/202 (1).png ... /assets/205 (7).png
export const plan = (block, n = 1) => encodeURI(`/assets/${block} (${n}).png`);
export const PLAN_COUNTS = { "201": 0, "202": 8, "203": 7, "204": 7, "205": 7 };

// ── Тоон үзүүлэлт ───────────────────────────────────────────────────────────
export const STATS = [
  { n: 14,  s: "",    label: "Нийт блок",              c: GREEN },
  { n: 10,  s: " га", label: "Газрын талбай",          c: BLUE },
  { n: 2,   s: "",    label: "Цахилгааны эх үүсвэр",    c: MUSTARD },
  { n: 600, s: " м",  label: "Үерийн усны далан",       c: GREEN },
  { n: 100, s: "%",   label: "PPR цэвэр усны хоолой",    c: BLUE },
];

// ── AWT концепц ─────────────────────────────────────────────────────────────
export const AWT = [
  { key: "Animal", mn: "Амьтан", icon: "🦌", color: MUSTARD,
    desc: "Амьтны хүрээлэн, интерактив парк — байгалийн амьдралтай ойр дотно орчин." },
  { key: "Water",  mn: "Ус",     icon: "💧", color: BLUE,
    desc: "Усан төхөөрөмж, тунгалаг орчин, тайван амгалан мэдрэмж." },
  { key: "Tree",   mn: "Мод",    icon: "🌳", color: GREEN,
    desc: "Өргөн ногоон байгууламж, мод тарьсан зүлэгжүүлэлт, эрүүл амьсгал." },
];

// ── Блокийн жинхэнэ дата (master plan) ──────────────────────────────────────
// badge = брэндийн ялгах өнгө, x/y = "All edited.jpg" дээрх hotspot байрлал.
export const BLOCKS = [
  { name: "201", x: "36.5%", y: "51%",   rooms: "2–4 өрөө", area: "47.9–105.6",  handover: "2027 II улирал", badge: "#E8536B" },
  { name: "202", x: "27.3%", y: "52.5%", rooms: "2–3 өрөө", area: "47.9–81.0",   handover: "2026–2027",      badge: "#5B8DD9" },
  { name: "203", x: "30%",   y: "40.5%", rooms: "2–4 өрөө", area: "48.7–124.1",  handover: "2026–2027",      badge: "#F0A020" },
  { name: "204", x: "26.8%", y: "30%",   rooms: "2–4 өрөө", area: "47.6–105.8",  handover: "2026–2027",      badge: "#6BB36B" },
  { name: "205", x: "34.5%", y: "29.5%", rooms: "2–4 өрөө", area: "48.7–125.9",  handover: "2026–2027",      badge: "#B57BD0" },
];
export const BLOCK_NOTE = "Талбайн хэмжээ дундаж бөгөөд давхрын сонголтоос хамаарч өөрчлөгдөнө.";
export const FLOOR_BLOCKS = BLOCKS.filter((b) => PLAN_COUNTS[b.name] > 0);

// ── Орчин (amenities) ───────────────────────────────────────────────────────
export const AMENITIES = [
  { icon: "🧒", title: "Хүүхдийн тоглоомын талбай", sub: "3–5 · 6–8 · 8–12 насны ангилал", c: MUSTARD },
  { icon: "🏀", title: "3×3 сагсан бөмбөг",          sub: "Спортын талбай",               c: BLUE },
  { icon: "🌳", title: "Ногоон байгууламж",          sub: "AWT зүлэгжүүлэлт",              c: GREEN },
  { icon: "🦌", title: "AWT парк",                    sub: "Animal · Water · Tree",        c: GREEN },
  { icon: "🏫", title: "Сургууль",                    sub: "Хороололд багтсан",            c: BLUE },
  { icon: "🧸", title: "Цэцэрлэг",                    sub: "Хүүхдэд ээлтэй",               c: MUSTARD },
  { icon: "🛍️", title: "Худалдаа үйлчилгээ",          sub: "1 давхрын нэгж",               c: GREEN },
];

// ── Дэд бүтэц ───────────────────────────────────────────────────────────────
export const INFRA = [
  { icon: "⚡", k: "Цахилгаан", v: "2 эх үүсвэр",  d: "Яармагийн дэд станцаас 2 км шугам — тасралтгүй.", c: GREEN },
  { icon: "💧", k: "Цэвэр ус",  v: "100% PPR",     d: "Зэврэхгүй хуванцар хоолой, чанартай ус.",          c: BLUE },
  { icon: "🌊", k: "Үерийн ус", v: "600 м далан",  d: "100 жилийн дундаж үерийг тооцсон хамгаалалт.",     c: MUSTARD },
];
export const BRANDS = [
  { k: "Egger",          d: "Паркет" },
  { k: "VEKA / Firatpen",d: "Цонх" },
  { k: "Torex",          d: "Гадна хаалга" },
  { k: "Legrand",        d: "Цахилгаан" },
  { k: "TOTO / INAX",    d: "Ариун цэврийн тоног" },
];

// ── Showroom / танилцуулга зургууд ──────────────────────────────────────────
// /* IMG */ — жинхэнэ загвар байр / интерьер render-ээр солих.
export const SHOWROOM = [
  { src: "/assets/images/fbouz.jpg",            cap: "Ерөнхий төрх",          grad: ["#7c9a6b", "#3f5b46"] },
  { src: A.renderFinal,                          cap: "Хорооллын төлөвлөлт",   grad: ["#9aa3b0", "#5a6a7e"] },
  { src: "/assets/images/residences/2uruu.jpg",  cap: "Интерьер · 2 өрөө",     grad: ["#cdbfb0", "#9a8c78"] },
  { src: "/assets/images/residences/3uruu.jpg",  cap: "Интерьер · 3 өрөө",     grad: ["#c9bfae", "#94886f"] },
];
export const SHOWROOM_INTRO =
  "Тэнцвэртэй, тайван, premium амьдрах орчин. Байгальтай зохицсон дизайн, гэр бүлд ээлтэй төлөвлөлт — таны ирээдүйн гэр.";

// ── Барилгын явц (construction progress) — огноогоор ─────────────────────────
// /* IMG */ — жинхэнэ drone/явцын зургаар солих.
export const CONSTRUCTION = [
  { date: "2025.03", label: "Суурь, хөрсний ажил",   src: "/assets/images/bkKky.jpg",   grad: ["#b6a98f", "#7c6f54"] },
  { date: "2025.07", label: "Их биеийн өргөтгөл",    src: "/assets/images/OxHR5.jpg",   grad: ["#a9b0b8", "#6f7780"] },
  { date: "2025.11", label: "Фасад, гадна засал",    src: encodeURI("/assets/All edited.jpg"), grad: ["#9aa3b0", "#5a6a7e"] },
];

// ── Байршил — ойролцоо ──────────────────────────────────────────────────────
export const NEARBY = [
  { icon: "🏬", t: "Хүннү молл" },
  { icon: "🎓", t: "British / Smart / Tomyo / Гурван Тамир" },
  { icon: "🏥", t: "Хан-Уул нэгдсэн эмнэлэг" },
  { icon: "⛰️", t: "Богдхан уул" },
  { icon: "🌊", t: "Туул гол" },
  { icon: "🚌", t: "Яармаг тээврийн зангилаа" },
];
