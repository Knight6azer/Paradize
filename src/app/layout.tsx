import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paradize — Read. Reflect. Grow Together.",
  description:
    "The world's most trusted reading community. Discover books, join meaningful discussions, track your growth, and connect with curious minds. Born in Mumbai, built for the world.",
  keywords: [
    "reading community",
    "book club",
    "book discussions",
    "personal growth",
    "reading tracker",
    "book recommendations",
    "Mumbai book club",
    "intellectual community",
  ],
  authors: [{ name: "Paradize" }],
  openGraph: {
    title: "Paradize — Read. Reflect. Grow Together.",
    description:
      "The world's most trusted reading community. Discover books, join meaningful discussions, and grow together.",
    type: "website",
    locale: "en_IN",
    siteName: "Paradize",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paradize — Read. Reflect. Grow Together.",
    description:
      "The world's most trusted reading community. Join meaningful discussions and grow together.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF5" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0F1A" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
