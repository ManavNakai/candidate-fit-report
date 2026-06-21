import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "tesseract.js"],
  allowedDevOrigins: ["172.16.221.178"],
};

export default nextConfig;

