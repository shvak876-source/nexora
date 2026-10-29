import type { Metadata, Viewport } from "next";
import { Heebo, Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";

const heading = Heebo({
  variable: "--font-heading",
  subsets: ["hebrew", "latin"],
  weight: ["600", "700", "800", "900"],
});

const body = Noto_Sans_Hebrew({
  variable: "--font-body",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nexora · אתרים, אפליקציות ומערכות ניהול לעסקים",
  description:
    "Nexora בונה לעסקים אתרים, אפליקציות ומערכות ניהול לפי מה שהעסק צריך, ומלווה אותם בניהול חודשי.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#05060b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heading.variable} ${body.variable} font-sans text-[17px] leading-relaxed antialiased sm:text-lg`}>
        {children}
      </body>
    </html>
  );
}
