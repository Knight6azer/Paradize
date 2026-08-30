import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is enabled by default in Next 16
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "books.google.com",
      },
      {
        protocol: "https",
        hostname: "books.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
      },
    ],
  },
};

export default nextConfig;
