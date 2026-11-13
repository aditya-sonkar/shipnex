"use client";

import { useRef } from "react";
import Image from "next/image";
import { useSectionReveal } from "./useSectionReveal";

interface Feature {
    id: string;
    title: string;
    description: string;
    icon: string;
    href: string;
}

const features: Feature[] = [
    {
        id: "01",
        title: "Instant Quote Calculator",
        description:
            "Instant, transparent freight cost estimates calculated from cargo origin, destination, and weight.",
        icon: "/images/svg/coolicons--calculator.svg",
        href: "/quote",
    },
    {
        id: "02",
        title: "Proactive Delay Alerts",
        description:
            "Early alerts for severe weather disruptions, port delays, and unexpected customs hold-ups.",
        icon: "/images/svg/siren-20-bold.svg",
        href: "/alerts",
    },
    {
        id: "03",
        title: "Digital Document Hub",
        description:
            "Bills of lading, customs filings, and verified commercial invoices organized in one secure hub.",
        icon: "/images/svg/ri--file-list-line.svg",
        href: "/documents",
    },
    {
        id: "04",
        title: "Real-Time Tracking",
        description:
            "Live GPS corridor tracking, automated arrival estimates, and milestone notifications 24/7.",
        icon: "/images/svg/andrsrxn--route-map-box.svg",
        href: "/tracking",
    },
];

export default function Features() {
    const sectionRef = useRef<HTMLElement>(null);
    const tagRef = useRef<HTMLSpanElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useSectionReveal({ sectionRef, tagRef, headingRef, descRef, itemsRef: gridRef });

    return (
        <section id="features" ref={sectionRef} className="overflow-hidden bg-white px-4 py-8 text-black sm:px-8 md:px-10 lg:px-12 lg:py-10">
            <div className="mx-auto w-full max-w-[1720px]">
                {/* Header */}
            <div className="mb-10 grid grid-cols-1 gap-6 sm:mb-14 sm:gap-8 md:grid-cols-2 lg:mb-20">
                <div>
                    <span ref={tagRef} className="mb-4 sm:mb-6 lg:mb-8 flex items-center gap-2 text-xs font-medium tracking-wider text-neutral-500 uppercase">
                        <span className="h-1.5 w-1.5 bg-neutral-500" />
                        FEATURES
                    </span>

                    <h2 ref={headingRef} className="max-w-none text-3xl sm:text-4xl md:text-5xl lg:text-[clamp(3.25rem,4.2vw,4.5rem)] font-semibold leading-[1.05] lg:leading-[0.95] tracking-[-0.04em]">
                        Built around what<br />shippers actually need.
                    </h2>
                </div>

                <p ref={descRef} className="max-w-md text-sm sm:text-base leading-[1.6] text-neutral-700 md:ml-auto md:mt-12 md:self-start lg:mt-16">
                    Flexible logistics solutions built around your cargo, timing
                    and requirements, across Europe and beyond.
                </p>
            </div>

            <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-[2fr_0.9fr_2fr_2fr] w-full min-w-0">
                {/* Truck IMG */}
                <div className="relative aspect-square sm:aspect-[2/1] lg:aspect-auto lg:h-full overflow-hidden order-1 lg:order-1 col-span-2 lg:col-span-2">
                    <Image
                        src="/images/truck_img.webp"
                        alt="Logistics truck"
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                    />
                </div>

                {features.map((feature) => (
                    <div
                        key={feature.id}
                        className={`group flex flex-col justify-between border border-neutral-200 bg-white p-3.5 sm:p-5 lg:p-6 transition-colors hover:bg-neutral-50/50 w-full min-w-0 max-w-full aspect-square lg:aspect-[5/4] ${feature.id === "01"
                            ? "order-2 lg:order-2 col-span-1 aspect-square"
                            : feature.id === "02"
                                ? "order-3 lg:order-3 col-span-1 aspect-square"
                                : feature.id === "03"
                                    ? "order-6 lg:order-4 col-span-1 aspect-square"
                                    : "order-5 lg:order-5 col-span-1 lg:col-span-2 aspect-square lg:aspect-auto lg:h-full"
                            }`}
                    >
                        <div className="flex h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 items-center justify-center bg-neutral-100">
                            <img
                                src={feature.icon}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                className="h-3.5 w-3.5 sm:h-4 sm:w-4 object-contain"
                            />
                        </div>

                        <div className="mt-2 sm:mt-4">
                            <h3 className="mb-1 sm:mb-2 text-xs sm:text-base lg:text-lg xl:text-xl font-semibold uppercase tracking-[-0.02em] leading-snug">
                                {feature.title}
                            </h3>

                            <p className="text-[11px] sm:text-sm leading-relaxed text-black/70 max-w-sm line-clamp-3 sm:line-clamp-4 lg:line-clamp-none">
                                {feature.description}
                            </p>

                            <a
                                href={feature.href}
                                aria-label={`Learn more about ${feature.title}`}
                                className="hidden lg:flex mt-2.5 sm:mt-4 items-center justify-between group/link"
                            >
                                <span className="bg-black text-white px-2.5 py-1 sm:px-4 sm:py-2 text-[9px] sm:text-[10px] font-medium tracking-wide transition-colors group-hover:bg-neutral-800">
                                    LEARN MORE
                                    <span className="sr-only"> about {feature.title}</span>
                                </span>

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                >
                                    <path d="M7 17 17 7" />
                                    <path d="M7 7h10v10" />
                                </svg>
                            </a>
                        </div>
                    </div>
                ))}

                {/* Cargo Handling IMG */}
                <div className="relative aspect-square sm:aspect-[2/1] lg:aspect-auto lg:h-full overflow-hidden order-4 lg:order-6 col-span-2 lg:col-span-1">
                    <Image
                        src="/images/cargo_freight.png"
                        alt="Cargo handling"
                        fill
                        loading="lazy"
                        sizes="(max-width: 1024px) 100vw, 25vw"
                        className="object-cover"
                    />
                </div>
            </div>
            </div>
        </section>
    );
}