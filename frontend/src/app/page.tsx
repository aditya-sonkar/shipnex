// "use client";

import dynamic from "next/dynamic";
import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";

const About = dynamic(() => import("./components/landing/About"), { ssr: true });
const Features = dynamic(() => import("./components/landing/Features"), { ssr: true });
const Pricing = dynamic(() => import("./components/landing/Pricing"), { ssr: true });
const FAQ = dynamic(() => import("./components/landing/FAQ"), { ssr: true });
const CTA = dynamic(() => import("./components/landing/CTA"), { ssr: true });
const Footer = dynamic(() => import("./components/landing/Footer"), { ssr: true });

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
};
