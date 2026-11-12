"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let cancelled = false;

    const init = () => {
      if (cancelled || cleanup) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        autoResize: true,
      });
      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      const updateTicker = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(updateTicker);
      gsap.ticker.lagSmoothing(0);

      let lastHeight = document.body.scrollHeight;
      let refreshTimer: ReturnType<typeof setTimeout> | null = null;

      const resizeObserver = new ResizeObserver(() => {
        const nextHeight = document.body.scrollHeight;
        if (nextHeight === lastHeight) return;
        lastHeight = nextHeight;

        if (refreshTimer) clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => {
          lenis.resize();
          ScrollTrigger.refresh();
        }, 250);
      });
      resizeObserver.observe(document.body);

      cleanup = () => {
        resizeObserver.disconnect();
        if (refreshTimer) clearTimeout(refreshTimer);
        gsap.ticker.remove(updateTicker);
        lenis.destroy();
      };
    };

    const timer = setTimeout(init, 6000);
    window.addEventListener("wheel", init, { once: true, passive: true });
    window.addEventListener("touchstart", init, { once: true, passive: true });
    window.addEventListener("keydown", init, { once: true, passive: true });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener("wheel", init);
      window.removeEventListener("touchstart", init);
      window.removeEventListener("keydown", init);
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
