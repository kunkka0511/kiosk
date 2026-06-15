// GET /api/toim
// /public/assets/toim/ доторх "ажлын явц"-ийн зургуудыг буцаана.
// Файлын нэр "2025.03 Суурь ажил.jpg" хэлбэртэй бол → date="2025.03", label="Суурь ажил".
// Огноогүй нэртэй бол зүгээр л зураг (badge/label-гүй) харагдана.
import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const IMG = /\.(jpe?g|png|webp|gif|avif)$/i;
// эхэнд он.сар (эсвэл он-сар, он.сар.өдөр) байвал огноо болгож тасална.
const DATE = /^\s*(\d{4})[.\-](\d{1,2})(?:[.\-](\d{1,2}))?\s*[-_–—.]*\s*(.*)$/;

export async function GET() {
  const dir = path.join(process.cwd(), "public", "assets", "toim");
  try {
    const files = await readdir(dir);
    const items = files
      .filter((f) => IMG.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
      .map((f) => {
        const name = f.replace(/\.[^.]+$/, "");
        const m = name.match(DATE);
        const date = m ? `${m[1]}.${String(m[2]).padStart(2, "0")}${m[3] ? "." + String(m[3]).padStart(2, "0") : ""}` : "";
        const label = m ? (m[4] || "").trim() : "";
        return { src: `/assets/toim/${encodeURIComponent(f)}`, date, label };
      });
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
