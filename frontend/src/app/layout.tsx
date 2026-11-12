import type { Metadata } from "next";
import { Geist_Mono, Inter, Outfit, DM_Sans } from "next/font/google";

import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Shipnex - Logistics & Intelligence",
  description: "ShipNex coordinates routing models that perceive, schedule, sort, and automate cargo transit through global physical networks.",
  metadataBase: new URL("https://shipnex.vercel.app"),
  icons: {
    icon: "/images/shipnex-box.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en" suppressHydrationWarning
      className={`${geistMono.variable} ${outfit.variable} ${inter.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
