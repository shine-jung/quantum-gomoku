import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/animations.css";
import "./globals.css";
import GoogleAnalytics from "@/components/google-analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quantum Gomoku",
  description: "양자 역학의 원리를 활용한 전략 게임",
  openGraph: {
    title: "Quantum Gomoku",
    description: "양자 역학의 원리를 활용한 전략 게임",
    type: "website",
    url: "https://quantum-gomoku.vercel.app",
    images: [
      {
        url: "https://quantum-gomoku.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Quantum Gomoku",
      },
    ],
    locale: "ko_KR",
    siteName: "Quantum Gomoku",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quantum Gomoku",
    description: "양자 역학의 원리를 활용한 전략 게임",
    images: ["https://quantum-gomoku.vercel.app/og-image.png"],
    creator: "@seogmin_je65632",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <body className={inter.className}>
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {children}
      </body>
    </html>
  );
}
