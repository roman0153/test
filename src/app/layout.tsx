import type { Metadata, Viewport } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollAnimations } from "@/components/scroll-animations";
import { getSiteUrl, images, site } from "@/lib/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: { default: "Eden Gardens — Záhrady, ktoré sa stanú domovom", template: "%s | Eden Gardens" },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "sk_SK",
    siteName: site.name,
    title: "Eden Gardens — Záhrady s myšlienkou",
    description: site.description,
    images: [{ url: images.garden, width: 1200, height: 630, alt: "Eden Gardens — záhradná architektúra" }],
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description, images: [images.garden] },
};

export const viewport: Viewport = { themeColor: "#f8f7f4", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sk">
      <body>
        <a className="skip-link" href="#main-content">Preskočiť na obsah</a>
        <Header />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <ScrollAnimations />
        <Footer />
      </body>
    </html>
  );
}