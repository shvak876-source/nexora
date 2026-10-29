import type { Metadata, Viewport } from "next";
import { Heebo, Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";
import { AccessibilityMenu, WhatsAppFab } from "@/components/site/floating";

// Static hosting (GitHub Pages) cannot send security headers, so the policy ships as a
// meta tag. Next.js inlines its bootstrap scripts, hence 'unsafe-inline'. Dev mode also
// needs eval for hot reload, so the policy is production-only.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://api.web3forms.com",
  "form-action 'self' https://api.web3forms.com",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

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
      <head>
        {process.env.NODE_ENV === "production" && <meta httpEquiv="Content-Security-Policy" content={CSP} />}
        <meta name="referrer" content="strict-origin-when-cross-origin" />
      </head>
      <body className={`${heading.variable} ${body.variable} font-sans text-[17px] leading-relaxed antialiased sm:text-lg`}>
        {children}
        <WhatsAppFab />
        <AccessibilityMenu />
      </body>
    </html>
  );
}
