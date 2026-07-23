import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SiteFooter, SiteHeader } from "./components";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://alan-watts-wisdom.feimster.chatgpt.site"),
  title: {
    default: "Alan Watts Wisdom — Authentic lectures, books and ideas",
    template: "%s | Alan Watts Wisdom",
  },
  description:
    "Explore Alan Watts through authentic historical lectures, books, source-verified quotations, essays and topic-led listening paths.",
  other: {
    "content-integrity": "source-grounded",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Alan Watts Wisdom",
    description: "A source-grounded listening library and philosophical magazine.",
    siteName: "Alan Watts Wisdom",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable}`}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
