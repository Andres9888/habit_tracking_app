import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Habits - Build Habits That Stick",
  description:
    "Track your daily habits with beautiful chain visualizations. Watch your streaks grow and build lasting habits with our intuitive iOS app.",
  keywords: [
    "habit tracker",
    "habit app",
    "streak tracker",
    "daily habits",
    "habit building",
    "iOS app",
    "chain visualization",
  ],
  authors: [{ name: "Daily Habits" }],
  openGraph: {
    title: "Daily Habits - Build Habits That Stick",
    description:
      "Track your daily habits with beautiful chain visualizations. Watch your streaks grow.",
    url: "https://dailyhabits.app",
    siteName: "Daily Habits",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Daily Habits App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Habits - Build Habits That Stick",
    description:
      "Track your daily habits with beautiful chain visualizations.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
