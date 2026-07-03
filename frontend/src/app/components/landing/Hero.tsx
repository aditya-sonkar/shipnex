"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative w-full h-screen min-h-[650px] overflow-hidden flex flex-col justify-between pt-32 pb-8 md:pb-12 text-white bg-zinc-950 select-none">
            {/* Background Video with Poster Fallback */}
            <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover scale-[1.01]"
                >
                    <source src="/videos/truck.mp4" type="video/mp4" />
                </video>
                {/* Dark Vignette Overlay for Readability */}
                <div className="absolute inset-0 bg-black/35 z-10" />
            </div>

            {/* Massive Red Left Chevron SVG Shape (Lodisna Style) */}
            <div className="absolute left-0 top-[12%] bottom-[8%] w-[20vw] min-w-[140px] max-w-[340px] z-15 pointer-events-none opacity-85">
                <svg className="w-full h-full text-[#b81d24]/60" viewBox="0 0 100 200" preserveAspectRatio="none">
                    <polygon points="0,0 100,100 0,200" fill="currentColor" />
                </svg>
            </div>

            {/* Top-Left Since Label */}
            <div className="absolute left-6 md:left-12 lg:left-16 top-[18%] z-20">
                <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-[#ef4444] uppercase">
                    Since 2026
                </span>
            </div>

            {/* Main Content Area - Giant Typography */}
            <div className="relative z-20 mx-auto w-full max-w-screen-2xl px-6 md:px-12 lg:px-16 flex-grow flex flex-col justify-center pt-16">
                <div className="w-full">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                        className="font-sans font-extralight uppercase text-[10vw] sm:text-[8vw] lg:text-[8vw] leading-[0.88] tracking-[-0.01em] text-white/95 text-left"
                    >
                        Logistics
                        <br />
                        &amp; Intelligence
                    </motion.h1>
                </div>
            </div>

            {/* Bottom Section - Paragraph, Tracking Search & Scroll Down */}
            <div className="relative z-20 mx-auto w-full max-w-screen-2xl px-6 md:px-12 lg:px-16 mt-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-t border-white/10 pt-8 pb-4">
                    {/* Empty Left Grid to offset content past the red chevron */}
                    <div className="lg:col-span-2 hidden lg:block" />

                    {/* Middle Column: Description & Glassmorphic Tracking Bar */}
                    <div className="lg:col-span-7 flex flex-col items-start gap-5">
                        <p className="text-[13px] md:text-sm text-white/80 leading-relaxed font-normal max-w-2xl text-pretty">
                            ShipNex is a versatile, constantly evolving logistics intelligence platform. We cover the specific transport, routing, and fleet coordination needs of our clients, meeting the highest standards of speed and efficiency.
                        </p>

                        <div className="w-full max-w-md bg-white/10 dark:bg-white/5 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-md">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const trackingId = (e.currentTarget.elements.namedItem('tracking') as HTMLInputElement).value;
                                    if (trackingId.trim()) window.location.href = `/track/${trackingId.trim().toUpperCase()}`;
                                }}
                                className="relative flex items-center"
                            >
                                <input
                                    type="text"
                                    name="tracking"
                                    placeholder="Enter Tracking ID (e.g. SX-10473)"
                                    className="w-full pl-5 pr-24 py-2.5 bg-transparent border-0 text-xs focus:outline-none placeholder:text-white/50 text-white"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1 top-1 bottom-1 px-5 bg-white hover:bg-white/90 text-zinc-950 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all shadow-sm cursor-pointer"
                                >
                                    Track
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Scroll Down Outline Pill */}
                    <div className="lg:col-span-3 flex justify-end">
                        <div className="flex items-center gap-3.5">
                            <div className="flex flex-col items-center gap-0.5 text-[#ef4444] animate-bounce">
                                <ChevronDown className="w-3.5 h-3.5" />
                                <ChevronDown className="w-3.5 h-3.5 -mt-2" />
                            </div>
                            <a
                                href="#features"
                                className="px-5 py-2.5 rounded-full border border-white/30 text-[10px] font-bold tracking-[0.15em] uppercase text-white/90 hover:bg-white hover:text-zinc-950 hover:border-white transition-all duration-300 cursor-pointer"
                            >
                                Scroll Down
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
