import { Suspense } from "react";
import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import SmoothScroll from "./components/SmoothScroll";
import Features from "./components/landing/Features";
import { About } from "./components/landing/about";
import Journey from "./components/landing/Journey";
import Services from "./components/landing/Services";
import WhyShipnex from "./components/landing/WhyShipnex";
import Keybenefits from "./components/landing/Keybenefits";
import Partners from "./components/landing/Partners";
import CTA from "./components/landing/CTA";
import FAQ from "./components/landing/FAQ";
import Footer from "./components/landing/Footer";
import AiAssistantLazy from "./components/AiAssistantLazy";

export default function LandingPage() {
  return (
    <SmoothScroll>
      <main className="relative min-h-screen bg-zinc-950 text-white font-dm">
        <Navbar />
        <Hero />
        <div className="relative z-20 bg-white">
          <Suspense>
            <About />
          </Suspense>
          <Suspense>
            <Features />
          </Suspense>
        </div>
        <Suspense>
          <Journey />
        </Suspense>
        <Suspense>
          <Services />
        </Suspense>
        <Suspense>
          <Keybenefits />
        </Suspense>
        <Suspense>
          <WhyShipnex />
        </Suspense>
        <Suspense>
          <Partners />
        </Suspense>
        <CTA />
        <Suspense>
          <FAQ />
        </Suspense>
        <Footer />
        <Suspense>
          <AiAssistantLazy />
        </Suspense>
      </main>
    </SmoothScroll>
  );
}
