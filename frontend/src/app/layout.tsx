import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";

const bastardoGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/bastardo-grotesk/BastardoGrotesk-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/bastardo-grotesk/BastardoGrotesk-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/bastardo-grotesk/BastardoGrotesk-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/bastardo-grotesk/BastardoGrotesk-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/bastardo-grotesk/BastardoGrotesk-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/bastardo-grotesk/BastardoGrotesk-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-bastardo",
  display: "swap",
});

const gangsterGrotesk = localFont({
  src: [
    {
      path: "../../public/fonts/Gangster Grotesk (OTF)/GangsterGrotesk-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gangster Grotesk (OTF)/GangsterGrotesk-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gangster Grotesk (OTF)/GangsterGrotesk-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-gangster",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Cormorant Garamond — elegant, high-contrast serif 
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Shipnex - Logistics & Intelligence",
  description: "ShipNex coordinates routing models that perceive, schedule, sort, and automate cargo transit through global physical networks.",
  metadataBase: new URL("https://shipnex.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en" suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${bastardoGrotesk.variable} ${gangsterGrotesk.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
