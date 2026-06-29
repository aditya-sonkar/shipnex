import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Automatically copy generated background image during Next.js startup/reload
try {
  const src = "C:/Users/adity/.gemini/antigravity-ide/brain/fdc2f698-0d06-450b-96b5-c8514f429674/shipping_cta_bg_realistic_1782299838341.png";
  const destDir = path.join(process.cwd(), "public");
  const dest = path.join(destDir, "shipping_cta_bg.png");
  
  if (fs.existsSync(src)) {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log(">>> [ShipNex Setup] Background image copied successfully.");
  }
} catch (e: any) {
  console.error(">>> [ShipNex Setup] Background copy failed:", e.message);
}

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || "http://localhost:5000"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
