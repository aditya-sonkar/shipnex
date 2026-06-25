"use client";

import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative overflow-hidden pt-24 pb-12 lg:pt-32 lg:pb-20">
            <div className="mx-auto w-full max-w-screen-2xl px-8 lg:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Left content column */}
                    <div className="lg:col-span-6 flex flex-col items-start text-left w-full">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            className="font-heading font-light text-foreground text-pretty lg:text-[72px] text-[48px] leading-[1.1] tracking-[-0.02em] select-none"
                        >
                            ShipNex
                            <br />
                            <span className="text-zinc-400 dark:text-zinc-400">
                                Logistics Intelligence
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-5 text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal max-w-md"
                        >
                            ShipNex is building the next frontier of logistics software — one where models can route, sort, and manage courier networks to automate global supply chains from local hubs to the doorstep.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-8 flex items-center gap-3"
                        >
                            <a
                                href="/login"
                                className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-7 py-3.5 text-[13px] font-semibold leading-none shadow-sm hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                Get Started Free
                            </a>
                            <a
                                href="#features"
                                className="inline-flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 px-7 py-3.5 text-[13px] font-semibold leading-none hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-foreground"
                            >
                                Learn More
                            </a>
                        </motion.div>

                        {/* Customer Tracking Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            className="mt-8 w-full max-w-sm"
                        >
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
                                    className="w-full pl-5 pr-24 py-3.5 rounded-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700 shadow-sm"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-foreground text-background rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
                                >
                                    Track
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Right column - Feature card-style Editorial Hero Card */}
                    <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full max-w-[620px] aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-900 shadow-2xl flex flex-col justify-between group cursor-pointer"
                        >
                            <div className="absolute inset-0 z-0">
                                <img
                                    src="/images/hero.png"
                                    alt="ShipNex Logistics Intelligence platform preview"
                                    className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-[1.03] transition-transform duration-[1.2s] ease-out"
                                />
                                {/* Overlay gradients for high contrast/readability */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
                            </div>

                            {/* Top Overlay Content */}
                            <div className="relative z-10 p-6 lg:p-8 border-b border-white/10">
                                <h3 className="text-white font-semibold tracking-tight text-lg lg:text-xl">
                                    Intelligent Route Dispatch
                                </h3>
                            </div>

                            {/* Bottom Overlay Content */}
                            <div className="relative z-10 p-6 lg:p-8 flex flex-col gap-3">
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {["ROUTING MESH", "TRANSIT LOGS", "AI SCHEDULING"].map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2.5 py-1 rounded bg-white/20 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold tracking-widest uppercase"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Description */}
                                <p className="text-sm text-zinc-200 leading-relaxed font-medium text-pretty mt-1">
                                    Dynamically cluster courier logs and dispatch routes across autonomous hubs.
                                </p>

                                {/* Explore Link */}
                                <div
                                    className="inline-flex items-center text-xs font-bold text-white group-hover:text-[#00e5a3] transition-colors mt-2"
                                >
                                    <span className="border-b border-white/30 group-hover:border-[#00e5a3]/50 pb-0.5">Explore System &rarr;</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800/50 grid grid-cols-2 md:grid-cols-4 gap-8 select-none"
                >
                    {[
                        { value: "99.9%", label: "Uptime SLA" },
                        { value: "50M+", label: "Shipments Tracked" },
                        { value: "120+", label: "Countries Served" },
                        { value: "<200ms", label: "API Response" },
                    ].map(stat => (
                        <div key={stat.label}>
                            <p className="font-sans font-light text-[2.2rem] sm:text-[2.8rem] tracking-tight text-zinc-900 dark:text-white leading-none">
                                {stat.value}
                            </p>
                            <p className="mt-2 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest leading-none">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
