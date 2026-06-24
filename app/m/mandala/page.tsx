import type { Metadata } from "next";
import MobileMandala from "./MobileMandala";

export const metadata: Metadata = {
  title: "Mandala Garden — Mobile танилцуулга",
  description: "Mandala Garden хотхоны төлөвлөлт, давуу тал болон үнэ авах хүсэлт.",
};

export default function MandalaMobilePage() {
  return <MobileMandala />;
}
