// Root layout for Sokol Skuhrov static site.
// Sets Czech locale, imports global Tailwind tokens, and applies system font stack.
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Tělocvičná Jednota Sokol Skuhrov",
    default: "Tělocvičná Jednota Sokol Skuhrov",
  },
  description: "Oficiální web T. J. Sokol Skuhrov. Aktuality, činnost, fotogalerie, sponzoři a kontakty.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="antialiased bg-bg text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 bg-bg text-foreground border border-border px-4 py-2 rounded-md shadow"
        >
          Přeskočit na obsah
        </a>
        <Header />
        <div className="content-background-wrapper">
          <main id="main-content">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
