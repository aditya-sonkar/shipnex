"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const services = [
    {
        number: "01",
        title: "Freight Forwarding",
        description:
            "Reliable freight solutions by air, sea, and land with customs support and seamless delivery.",
        icon: "/images/svg/cart-flatbed.svg",
    },
    {
        number: "02",
        title: "Warehousing and Storage",
        description:
            "Flexible storage solutions with secure facilities and real-time inventory visibility.",
        icon: "/images/svg/warehouse.svg",
    },
    {
        number: "03",
        title: "Supply Chain Management",
        description:
            "Optimize every stage of your supply chain to reduce costs and keep goods moving smoothly.",
        icon: "/images/svg/supply-chain.svg",
    },
];

const METRICS = [
    { target: 150, decimals: 0, suffix: "K+", label: "Shipments", highlight: false },
    { target: 85, decimals: 0, suffix: "+", label: "Corridors", highlight: false },
    { target: 99.4, decimals: 1, suffix: "%", label: "On-Time", highlight: true },
] as const;

function animateMetrics(container: HTMLElement | null) {
    if (!container) return;
    container.querySelectorAll<HTMLElement>("[data-metric]").forEach((el) => {
        const target = Number(el.dataset.target || 0);
        const decimals = Number(el.dataset.decimals || 0);
        const suffix = el.dataset.suffix || "";
        const counter = { val: 0 };

        gsap.to(counter, {
            val: target,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => {
                const formatted = decimals > 0 ? counter.val.toFixed(decimals) : Math.round(counter.val);
                el.textContent = `${formatted}${suffix}`;
            },
        });
    });
}

export function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement>(null);
    const shadowRef = useRef<HTMLDivElement>(null);
    const desktopMetricsRef = useRef<HTMLDivElement>(null);
    const mobileMetricsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !sectionRef.current) return;

        let ctx: gsap.Context | null = null;
        let initialized = false;

        const initAbout = () => {
            if (initialized || !containerRef.current || !sectionRef.current) return;
            initialized = true;
            gsap.registerPlugin(ScrollTrigger);

            ctx = gsap.context(() => {
                const mm = gsap.matchMedia();

                // Desktop (>= 768px): Pinned scroll reveal
                mm.add("(min-width: 768px)", () => {
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            end: "+=650",
                            pin: true,
                            scrub: 1,
                            anticipatePin: 1,
                        },
                    });

                    // Initial states: Cards & shadow hidden
                    gsap.set(cardsRef.current, { opacity: 0, x: -25 });
                    gsap.set(shadowRef.current, { opacity: 0 });

                    // 1. Container centers & docks to right frame
                    tl.fromTo(
                        containerRef.current,
                        { x: -160, y: 15, scale: 1.18 },
                        { x: 0, y: 0, scale: 1, ease: "power2.inOut" },
                        0
                    );

                    // 2. Cards reveal smoothly on left
                    tl.to(
                        cardsRef.current,
                        { opacity: 1, x: 0, ease: "power2.out" },
                        0.35
                    );

                    // 3. Ground shadow reveals
                    tl.to(
                        shadowRef.current,
                        { opacity: 1, ease: "power2.out" },
                        0.35
                    );

                    ScrollTrigger.create({
                        trigger: sectionRef.current,
                        start: "top+=180 top",
                        once: true,
                        onEnter: () => animateMetrics(desktopMetricsRef.current),
                    });
                });

                // Mobile (< 768px): Count-up metrics when scrolled into view
                mm.add("(max-width: 767px)", () => {
                    if (!mobileMetricsRef.current) return;
                    ScrollTrigger.create({
                        trigger: mobileMetricsRef.current,
                        start: "top 90%",
                        once: true,
                        onEnter: () => animateMetrics(mobileMetricsRef.current),
                    });
                });
            }, sectionRef);
        };

        const timer = setTimeout(initAbout, 6000);
        window.addEventListener("wheel", initAbout, { once: true, passive: true });
        window.addEventListener("touchstart", initAbout, { once: true, passive: true });
        window.addEventListener("scroll", initAbout, { once: true, passive: true });

        return () => {
            clearTimeout(timer);
            window.removeEventListener("wheel", initAbout);
            window.removeEventListener("touchstart", initAbout);
            window.removeEventListener("scroll", initAbout);
            ctx?.revert();
        };
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative w-full bg-white text-black py-8 md:py-8 lg:py-10 px-4 sm:px-6 md:px-10 lg:px-12 overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
            {/* Watermark — desktop only */}
            <div className="hidden md:block absolute -bottom-3 right-6 font-black tracking-[-0.05em] text-[12vw] leading-none text-neutral-100/70 select-none pointer-events-none -z-0">
                shipnex
            </div>

            <div className="relative z-10 mx-auto w-full max-w-[1720px]">

                {/* ── MOBILE LAYOUT (hidden on md+) ── */}
                <div className="md:hidden">
                    {/* Tag */}
                    <span className="mb-3.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
                        <span className="h-1.5 w-1.5 bg-neutral-600" />
                        WHAT WE DO
                    </span>

                    {/* Large statement text matching reference */}
                    <h2 className="text-[1.45rem] leading-[1.3] font-normal tracking-[-0.02em] text-neutral-900 mb-5">
                        We help businesses streamline global logistics with{" "}
                        <span className="text-[#dc2626] font-medium">reliable, efficient,</span>{" "}
                        and scalable solutions that keep supply chains moving forward.
                    </h2>

                    {/* Full-width container display with atmospheric lighting */}
                    <div className="relative w-full py-2 flex flex-col items-center justify-center mb-6">
                        <div className="absolute w-[220px] h-[150px] bg-red-500/[0.07] rounded-full blur-2xl pointer-events-none" />
                        <Image
                            src="/images/shipnex_container1.webp"
                            alt="Shipnex Container"
                            width={1260}
                            height={918}
                            sizes="(max-width: 768px) 340px, 740px"
                            className="relative z-10 w-full max-w-[340px] h-auto object-contain select-none"
                        />
                        <div className="w-[68%] h-3.5 -mt-2 bg-neutral-950/[0.12] rounded-[100%] blur-md pointer-events-none" />
                    </div>

                    {/* Horizontal swipeable cards (peeking card style like reference) */}
                    <div className="flex overflow-x-auto gap-3 -mx-4 px-4 pb-3 no-scrollbar snap-x snap-mandatory">
                        {services.map((service) => (
                            <div
                                key={service.number}
                                className="w-[74vw] max-w-[275px] min-h-[175px] shrink-0 snap-start flex flex-col justify-between gap-6 border border-neutral-200/70 bg-white p-5"
                            >
                                <div className="flex h-9 w-9 items-center justify-center bg-neutral-100 p-2">
                                    <img
                                        src={service.icon}
                                        alt=""
                                        className="h-full w-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-[15px] font-semibold text-neutral-900 mb-1.5 leading-snug">
                                        {service.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile Trust Metrics */}
                    <div ref={mobileMetricsRef} className="flex items-start justify-between gap-4 px-1 pt-4 mt-2">
                        {METRICS.map((m) => (
                            <div key={m.label}>
                                <div
                                    data-metric
                                    data-target={m.target}
                                    data-decimals={m.decimals}
                                    data-suffix={m.suffix}
                                    className={`text-base font-bold tracking-tight tabular-nums ${m.highlight ? "text-[#dc2626]" : "text-neutral-900"}`}
                                >
                                    {m.decimals > 0 ? `0.0${m.suffix}` : `0${m.suffix}`}
                                </div>
                                <div className="mt-0.5 text-[10px] text-neutral-500 uppercase tracking-wider">{m.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── DESKTOP LAYOUT (hidden on mobile) ── */}
                <div className="hidden md:block">
                    {/* Top Header Row: Left = WHAT WE DO, Right = Editorial Statement Headline */}
                    <div className="grid grid-cols-12 gap-8 items-start mb-5 lg:mb-7">
                        <div className="col-span-4 pt-1">
                            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
                                <span className="h-1.5 w-1.5 bg-neutral-600" />
                                WHAT WE DO
                            </span>
                        </div>

                        <div className="col-span-8">
                            <h2 className="text-3xl lg:text-4xl xl:text-[clamp(34px,2.5vw,40px)] font-normal leading-[1.2] tracking-[-0.03em] text-neutral-900">
                                We help businesses streamline global logistics with{" "}
                                <span className="text-[#dc2626] font-medium">reliable, efficient,</span>{" "}
                                and scalable solutions that keep supply chains moving forward.
                            </h2>
                        </div>
                    </div>

                    {/* Bottom Row: Left = 3 Service Cards + Metrics, Right = Container Media */}
                    <div className="grid grid-cols-12 gap-8 items-start">
                        {/* Left: 3 Stacked Cards + Trust Metrics */}
                        <div ref={cardsRef} className="col-span-4 flex flex-col gap-3">
                            {services.map((service) => (
                                <div
                                    key={service.number}
                                    className="flex min-h-[168px] flex-col justify-between gap-6 border border-neutral-200/60 bg-[#FAFAFA]/70 p-5 transition-colors hover:bg-neutral-50"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center bg-white border border-neutral-200/60 p-2">
                                        <img
                                            src={service.icon}
                                            alt=""
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-[15px] font-semibold text-neutral-900 mb-1.5 leading-snug">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm text-neutral-700 leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Trust Metrics */}
                            <div ref={desktopMetricsRef} className="flex items-start justify-between gap-4 px-1 pt-3">
                                {METRICS.map((m) => (
                                    <div key={m.label}>
                                        <div
                                            data-metric
                                            data-target={m.target}
                                            data-decimals={m.decimals}
                                            data-suffix={m.suffix}
                                            className={`text-lg lg:text-xl font-bold tracking-tight tabular-nums ${m.highlight ? "text-[#dc2626]" : "text-neutral-900"}`}
                                        >
                                            {m.decimals > 0 ? `0.0${m.suffix}` : `0${m.suffix}`}
                                        </div>
                                        <div className="mt-0.5 text-[10px] text-neutral-500 uppercase tracking-wider">{m.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Container Media Showcase */}
                        <div className="relative col-span-8 flex flex-col items-center justify-center">
                            {/* Ambient glow */}
                            <div className="absolute w-[440px] lg:w-[560px] h-[300px] bg-gradient-to-tr from-red-500/[0.05] via-rose-500/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />

                            <div
                                ref={containerRef}
                                className="relative z-10 w-full max-w-[650px] lg:max-w-[740px] flex items-center justify-center will-change-transform"
                            >
                                <Image
                                    src="/images/shipnex_container1.webp"
                                    alt="Shipnex Container"
                                    width={1260}
                                    height={918}
                                    sizes="(max-width: 1024px) 650px, 740px"
                                    className="w-full h-auto object-contain select-none relative z-10"
                                />
                            </div>

                            {/* Ground shadow */}
                            <div
                                ref={shadowRef}
                                className="w-[72%] max-w-[500px] h-5 -mt-4 bg-neutral-950/[0.14] rounded-[100%] blur-xl pointer-events-none"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
