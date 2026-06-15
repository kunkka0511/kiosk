// GET /api/amenities/<slug>
// /public/assets/amenities/<slug>/ доторх зургуудыг (нэрээр нь эрэмбэлж) буцаана.
// → Folder-т зураг хийхэд л card дээр gallery-д орж ирнэ (код засах шаардлагагүй).
import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const IMG = /\.(jpe?g|png|webp|gif|avif)$/i;

export async function GET(_req, { params }) {
  const { slug } = await params;
  const safe = String(slug).replace(/[^a-z0-9_-]/gi, ""); // path traversal-аас хамгаална
  const dir = path.join(process.cwd(), "public", "assets", "amenities", safe);
  try {
    const files = await readdir(dir);
    const images = files
      .filter((f) => IMG.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
      .map((f) => `/assets/amenities/${safe}/${encodeURIComponent(f)}`);
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
