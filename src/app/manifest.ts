import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Paradize Reading Community",
    short_name: "Paradize",
    description: "Read. Reflect. Grow Together. The world's most trusted reading community.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF5",
    theme_color: "#2D5F3E",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
