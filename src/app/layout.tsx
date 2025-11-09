// Root layout for Sokol Skuhrov static site.
// Sets Czech locale, imports global Tailwind tokens, and applies system font stack.
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tělocvičná jednota Sokol Skuhrov",
  description: "Oficiální web T. J. Sokol Skuhrov. Aktuality, činnost, fotogalerie, sponzoři a kontakty.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="antialiased bg-bg text-foreground">{children}</body>
    </html>
  );
}
