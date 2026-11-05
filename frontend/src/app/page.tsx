"use client";

import dynamic from "next/dynamic";
import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import SmoothScroll from "./components/SmoothScroll";
import Pricing from "./components/landing/Pricing";

const Journey   = dynamic(() => import("./components/landing/Journey"),   { ssr: false });
const Features  = dynamic(() => import("./components/landing/Features"),  { ssr: false });
const Solutions = dynamic(() => import("./components/landing/Solutions"), { ssr: false });
const Impact    = dynamic(() => import("./components/landing/Impact"),    { ssr: false });
const Footer    = dynamic(() => import("./components/landing/Footer"),    { ssr: true  });

export default function LandingPage() {
  return (
    <SmoothScroll>
      <main className="relative min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <Hero />
        <Solutions />
        <Journey />
        <Features />
        <Pricing />
        <Impact />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
