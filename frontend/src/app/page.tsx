// "use client";

import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import About from "./components/landing/About";
import Platform from "./components/landing/Platform";
import Features from "./components/landing/Features";
import Pricing from "./components/landing/Pricing";
import FAQ from "./components/landing/FAQ";
import CTA from "./components/landing/CTA";
import Footer from "./components/landing/Footer";



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
