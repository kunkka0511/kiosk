import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mandala Garden — Байгальтай зохицсон амьдрах орчин",
  description: "AWT — Animal · Water · Tree. Яармаг–Арцатын хөндий, 10 га, 14 блок.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="mn" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
