import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import HeroVideo from "./HeroVideo";

export default function Hero() {
    return (
        <section className="relative z-20 isolate w-full h-screen min-h-[680px] overflow-hidden flex flex-col justify-between pt-28 pb-8 md:pb-12 text-white bg-zinc-950 select-none">
            {/* Background Video with Poster Fallback */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <Image
                    src="/images/hero-poster.webp"
                    alt=""
                    fill
                    priority
                    fetchPriority="high"
                    sizes="100vw"
                    aria-hidden="true"
                    className="object-cover scale-[1.01]"
                />
                <HeroVideo />
                {/* Dark Vignette Overlay for Readability */}
                <div className="absolute inset-0 bg-black/40 z-10" />
            </div>

            {/* Massive Red Left Chevron SVG Shape (Lodisna Style) */}
            <div className="absolute left-0 top-[12%] bottom-[8%] w-[18vw] min-w-[130px] max-w-[320px] z-10 pointer-events-none opacity-85 select-none">
                <svg className="w-full h-full text-[#b81d24]/65" viewBox="0 0 100 200" preserveAspectRatio="none">
                    <polygon points="0,0 100,100 0,200" fill="currentColor" />
                </svg>
            </div>

            {/* Top-Left Since Label */}
            <div className="absolute left-6 md:left-12 lg:left-16 top-[16%] md:top-[18%] z-20">
                <span className="text-[10px] md:text-xs font-inter font-bold tracking-[0.2em] text-[#ef4444] uppercase">
                    Since 2026
                </span>
            </div>

            {/* Main Content Area - Giant Typography */}
            <div className="relative z-20 mx-auto w-full max-w-screen-2xl px-6 md:px-12 lg:px-16 flex-grow flex flex-col justify-center pt-12 md:pt-16">
                <div className="w-full">
                    <h1
                        className="animate-fade-in-up font-dm font-light uppercase text-[clamp(44px,7.8vw,140px)] leading-[0.88] tracking-[-0.01em] text-white/95 text-left"
                    >
                        Logistics
                        <br />
                        <span className="whitespace-nowrap">&amp; Intelligence</span>
                    </h1>
                </div>
            </div>

            {/* Bottom Section - Paragraph & Action Buttons */}
            <div className="relative z-20 mx-auto w-full max-w-screen-2xl px-6 md:px-12 lg:px-16 mt-auto pb-6 md:pb-10">
                <div className="flex flex-col items-start gap-4 max-w-xl">
                    <p className="font-dm text-xs sm:text-sm text-white/85 leading-relaxed font-normal text-pretty">
                        ShipNex is a versatile logistics intelligence platform covering dynamic routing, fleet telemetry, and real-time corridor orchestration at scale.
                    </p>

                    <div className="flex flex-wrap items-center gap-3.5 pt-1">
                        <Link
                            href="/track"
                            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white text-zinc-950 font-inter font-bold text-xs uppercase tracking-widest hover:bg-[#fde047] transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Search className="w-3.5 h-3.5" />
                            Track Shipment »
                        </Link>
                        <a
                            href="#journey"
                            className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.16] backdrop-blur-md border border-white/20 text-white font-inter font-semibold text-xs uppercase tracking-widest transition-all hover:border-white/40 active:scale-[0.98]"
                        >
                            Explore Platform »
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
