import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://kanglena.github.io"),
  title: { default: "강인아", template: "%s | 강인아" },
  description: "만들기 좋아하는 중2 강인아의 작업과 글을 모아둔 공간이에요.",
  openGraph: {
    title: "강인아",
    description: "만들기 좋아하는 중2 강인아의 작업과 글.",
    url: "https://kanglena.github.io",
    images: ["/og.png"],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full"><AppShell>{children}</AppShell></body>
    </html>
  );
}
