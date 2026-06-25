"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const ctaLinks = [
    { href: "#features", label: "About" },
    { href: "#features", label: "Platform Capabilities" },
    { href: "#pricing", label: "Pricing" },
    { href: "#", label: "API Docs" },
    { href: "#", label: "Careers" },
    { href: "#", label: "Terms of Service" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Security" },
];

export default function CTA() {
    return (
        <section className="px-8 lg:px-16 py-12 lg:py-16 relative select-none">
            <div className="mx-auto w-full max-w-screen-2xl">
                {/* World Labs exact blue CTA card layout with full-bleed background image */}
                <div className="relative rounded-[32px] bg-[#2a679c] text-white pt-12 pb-12 px-6 sm:px-12 sm:pt-16 sm:pb-20 min-h-[420px] sm:min-h-[500px] lg:min-h-[560px] flex flex-col items-center justify-between shadow-2xl border border-white/10 overflow-hidden">

                    {/* Full-bleed Wide Landscape Image Background */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none">
                        <Image
                            src="/shipping_cta_bg.png"
                            alt="ShipNex Logistics Spatial Landscape Illustration"
                            fill
                            className="object-cover object-center sm:object-center"
                            priority
                            unoptimized
                            quality={100}
                        />
                        {/* High-contrast overlays to guarantee text readability */}
                        <div className="absolute inset-0 bg-zinc-950/40 pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-zinc-950/70 pointer-events-none" />
                    </div>

                    {/* Centered Large Top Title: Elegant Serif Sentence Case */}
                    <h2 className="relative z-10 font-heading text-white text-pretty lg:text-[64px] sm:text-[40px] text-[32px] leading-[1.2] tracking-[-0.05em] text-center max-w-3xl">
                        Unleash efficiency
                        <br />
                        with ShipNex
                    </h2>

                    {/* Left Column Stacked Links: Sentence Case, Small, Muted */}
                    <div className="relative lg:absolute lg:left-12 lg:top-1/2 lg:-translate-y-1/2 z-20 flex flex-row flex-wrap justify-center gap-x-5 gap-y-2.5 lg:flex-col lg:gap-4 lg:items-start lg:text-left mt-6 lg:mt-0 w-full lg:w-48 text-center">
                        {ctaLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-xs font-sans font-medium text-white/90 hover:text-white transition-colors cursor-pointer drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Overlapping Pill Action Button positioned exactly over the top part of the centered crystal ball */}
                    <div className="relative lg:absolute lg:bottom-[30%] lg:left-1/2 lg:-translate-x-1/2 mt-6 lg:mt-0 z-20">
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 bg-[#22252a] hover:bg-[#1a1c1e] text-white text-[11px] font-sans font-medium px-5 py-3.5 rounded-full border border-white/10 hover:border-white/20 transition-all hover:scale-102 shadow-xl cursor-pointer group"
                        >
                            Create Shipment
                            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:translate-x-0.5 transition-transform">
                                <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}