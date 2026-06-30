import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-mono",
  display: "swap",
});

const OG_DESC =
  "코드로 학교의 불편을 푸는 학생 개발자 강인아(Lena). · A middle-school student developer who turns school friction into code.";

export const metadata: Metadata = {
  metadataBase: new URL("https://kanglena.github.io"),
  title: "강인아 (Lena) — 학생 개발자 포트폴리오",
  description:
    "대치중학교 2학년 학생 개발자 강인아(Lena). 불편함을 코드로 푸는 사람. 대표작: 가온케어. · Lena Kang — a student developer in Seoul who turns friction into code.",
  openGraph: {
    title: "강인아 (Lena) — 학생 개발자 포트폴리오",
    description: OG_DESC,
    url: "https://kanglena.github.io",
    images: ["/og.png"],
    locale: "ko_KR",
    alternateLocale: ["en_US"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "강인아 (Lena) — 학생 개발자 포트폴리오",
    description: OG_DESC,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
