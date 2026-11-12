"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ComponentType } from "react";
import type { JourneyInteractiveProps } from "./JourneyInteractive";

function subscribeMediaQuery(callback: () => void) {
    const mq = window.matchMedia("(min-width: 768px)");
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
}

function getDesktopSnapshot() {
    return window.matchMedia("(min-width: 768px)").matches;
}

function getServerSnapshot() {
    return false;
}

export default function Journey() {
    const sectionRef = useRef<HTMLElement>(null);
    const [TrackComponent, setTrackComponent] = useState<ComponentType<JourneyInteractiveProps> | null>(null);
    const isDesktop = useSyncExternalStore(subscribeMediaQuery, getDesktopSnapshot, getServerSnapshot);

    useEffect(() => {
        const secEl = sectionRef.current;
        if (!secEl) return;

        let active = true;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    observer.disconnect();
                    import("./JourneyInteractive").then((mod) => {
                        if (active) setTrackComponent(() => mod.default);
                    });
                }
            },
            { rootMargin: "1000px 0px" }
        );
        observer.observe(secEl);

        return () => {
            active = false;
            observer.disconnect();
        };
    }, []);

    return (
        <section ref={sectionRef} id="journey" className="relative z-10 w-full bg-[#E22D22] text-white select-none overflow-hidden">
            {/* Desktop view */}
            <div className="hidden md:block relative pb-0">
                <div className="absolute top-8 lg:top-10 right-8 lg:right-14 max-w-md lg:max-w-xl xl:max-w-2xl z-10 pointer-events-none">
                    <h2 className="font-dm text-3xl sm:text-4xl md:text-5xl lg:text-[4.2vw] font-semibold leading-[1.05] lg:leading-[0.95] tracking-[-0.04em] text-white">
                        Every Mile, <span className="text-[#fde047]">Tracked.</span>
                        <br />Every Border, Cleared
                    </h2>
                    <p className="font-dm mt-3.5 text-base lg:text-lg text-white/85 leading-relaxed max-w-xl">
                        Autonomous multi-modal telemetry, predictive customs clearance, and self-healing delivery corridors across 140+ countries.
                    </p>
                </div>

                <div className="absolute top-[900px] right-8 lg:right-14 text-right pointer-events-none -z-10 flex flex-col items-end leading-[0.80]">
                    <span className="text-[16vw] font-inter font-black uppercase text-white/5 tracking-tighter whitespace-nowrap">Global</span>
                    <span className="text-[16vw] font-inter font-black uppercase text-white/5 tracking-tighter whitespace-nowrap">Corridors</span>
                </div>

                {TrackComponent && isDesktop ? (
                    <TrackComponent sectionRef={sectionRef} variant="desktop" />
                ) : (
                    <div className="relative z-20 w-full flex justify-center overflow-visible pointer-events-none">
                        <div className="w-full max-w-[1200px] aspect-[1200/1650]" />
                    </div>
                )}
            </div>

            {/* Mobile view */}
            <div className="md:hidden relative pb-0">
                <div className="absolute top-12 right-3 sm:right-5 w-[65%] max-w-[245px] sm:max-w-[270px] z-10 text-right pointer-events-none">
                    <h2 className="font-dm text-[26px] sm:text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-white">
                        Every Mile, <span className="text-[#fde047]">Tracked.</span><br />Every Border, Cleared
                    </h2>
                    <p className="font-dm mt-3 text-[11px] sm:text-[12.5px] text-white/85 leading-snug max-w-[220px] ml-auto">
                        Autonomous multi-modal telemetry and self-healing delivery corridors across nations
                    </p>
                </div>

                <div className="absolute top-[62%] right-3 sm:right-5 text-right pointer-events-none z-0 flex flex-col items-end leading-[0.80]">
                    <span className="text-[17vw] font-inter font-black uppercase text-white/5 tracking-tighter whitespace-nowrap">Global</span>
                    <span className="text-[17vw] font-inter font-black uppercase text-white/5 tracking-tighter whitespace-nowrap">Corridors</span>
                </div>

                {TrackComponent && !isDesktop ? (
                    <TrackComponent sectionRef={sectionRef} variant="mobile" />
                ) : (
                    <div className="relative z-20 w-full flex justify-center overflow-visible pointer-events-none">
                        <div className="w-full max-w-[390px] aspect-[390/1465]" />
                    </div>
                )}
            </div>
        </section>
    );
}
