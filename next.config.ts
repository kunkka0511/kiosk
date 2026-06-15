import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Offline kiosk — build үед бүх шаардлагатай зүйлийг өөртөө багтаасан
  // .next/standalone/ folder үүсгэнэ. Тэр folder-ийг kiosk PC рүү хуулаад
  // `node server.js`-ээр интернетгүй ажиллуулна.
  output: "standalone",
};

export default nextConfig;
