"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

    // Refs for animated dotted highway & 3D cargo box (Desktop & Mobile)
    const sectionRef = useRef<HTMLElement>(null);
    const desktopBoxRef = useRef<SVGGElement>(null);
    const desktopPathRef = useRef<SVGPathElement>(null);
    const mobileBoxRef = useRef<SVGGElement>(null);
    const mobilePathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

        const secEl = sectionRef.current;
        if (!secEl) return;

        const isMobile = () => window.innerWidth < 768;

        const setupAnimation = () => {
            const mobile = isMobile();
            const boxEl = mobile ? mobileBoxRef.current : desktopBoxRef.current;
            const pathEl = mobile ? mobilePathRef.current : desktopPathRef.current;
            if (!boxEl || !pathEl) return null;

            return gsap.context(() => {
                gsap.set(boxEl, { autoAlpha: 0, transformOrigin: "50% 50%" });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: secEl,
                        start: mobile ? "top 60%" : "top 70%",
                        end: mobile ? "bottom 15%" : "bottom 20%",
                        scrub: 0.8,
                    },
                });

                // Single smooth continuous glide along path
                tl.to(boxEl, {
                    motionPath: {
                        path: pathEl,
                        align: pathEl,
                        alignOrigin: [0.5, 0.5],
                        autoRotate: false,
                    },
                    ease: "none",
                    duration: 10,
                }, 0);

                // Fade in entering Pricing, fade out exiting
                tl.fromTo(boxEl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power1.out" }, 0.05);
                tl.to(boxEl, { autoAlpha: 0, duration: 0.4, ease: "power1.in" }, 9.5);
            }, secEl);
        };

        let ctx = setupAnimation();

        const onResize = () => {
            ctx?.revert();
            ctx = setupAnimation();
            ScrollTrigger.refresh();
        };

        window.addEventListener("resize", onResize);
        const t = setTimeout(() => ScrollTrigger.refresh(), 300);

        return () => {
            clearTimeout(t);
            window.removeEventListener("resize", onResize);
            ctx?.revert();
        };
    }, []);

    const plans = [
        {
            name: "Starter",
            price: "Free",
            yearlyPrice: "Free",
            period: "",
            yearlyPeriod: "",
            description: "For small teams getting started with logistics.",
            features: [
                "Up to 100 shipments",
                "1 hub, 5 delivery agents",
                "Basic public tracking page",
                "Community support",
                "REST API Access",
            ],
            cta: "Get Started Free",
            href: "/signup",
            highlighted: false,
        },
        {
            name: "Professional",
            price: "$49",
            yearlyPrice: "$39",
            period: "/mo",
            yearlyPeriod: "/mo",
            yearlyNote: "Billed annually ($468/yr)",
            description: "For growing operations that need real-time control.",
            features: [
                "Unlimited shipments",
                "10 hubs, 50 delivery agents",
                "Live tracking + dynamic ETAs",
                "AI route planning solver",
                "Priority email support",
                "Webhooks & developer API keys",
                "Analytics dashboard portal",
            ],
            cta: "Start Free Trial",
            href: "/signup?plan=pro",
            highlighted: true,
        },
        {
            name: "Enterprise",
            price: "Custom",
            yearlyPrice: "Custom",
            period: "",
            yearlyPeriod: "",
            description: "For large-scale courier networks and fleets.",
            features: [
                "Everything in Pro",
                "Unlimited hubs & agents",
                "White-label tracking portal",
                "Custom system integrations",
                "Dedicated technical account mgr",
                "99.9% Uptime SLA guarantee",
                "On-premise deployment option",
            ],
            cta: "Contact Sales",
            href: "/contact",
            highlighted: false,
        },
    ];

    return (
        <section
            ref={sectionRef}
            id="pricing"
            className="px-4 sm:px-8 lg:px-16 pt-16 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-36 relative overflow-hidden bg-[#0B1726] text-white select-none"
        >
            {/* Desktop background highway & 3D box */}
            <div className="hidden md:block absolute inset-0 pointer-events-none z-0 overflow-visible">
                <svg
                    viewBox="0 0 1200 900"
                    className="w-full h-full max-w-screen-2xl mx-auto overflow-visible"
                    preserveAspectRatio="none"
                >
                    <path
                        ref={desktopPathRef}
                        d="M 600 0 C 350 200 200 450 600 650 C 950 800 800 900 600 900"
                        fill="none"
                        stroke="#B2BEB5"
                        strokeWidth="3.5"
                        strokeDasharray="2 8"
                        className="opacity-35"
                    />
                    <g
                        ref={desktopBoxRef}
                        style={{ opacity: 0, visibility: "hidden" }}
                        transform="translate(600, -200)"
                    >
                        <image
                            href="/images/shipnex-box.svg"
                            x="-48"
                            y="-50"
                            width="96"
                            height="100"
                        />
                    </g>
                </svg>
            </div>

            {/* Mobile background highway & 3D box */}
            <div className="md:hidden absolute inset-0 pointer-events-none z-0 overflow-visible flex justify-center">
                <svg
                    viewBox="0 0 390 1900"
                    className="w-full h-full max-w-[390px] overflow-visible"
                    preserveAspectRatio="none"
                >
                    <path
                        ref={mobilePathRef}
                        d="M 195 0 C 60 250 50 600 195 900 C 340 1200 330 1550 195 1900"
                        fill="none"
                        stroke="#B2BEB5"
                        strokeWidth="3"
                        strokeDasharray="2 7"
                        className="opacity-35"
                    />
                    <g
                        ref={mobileBoxRef}
                        style={{ opacity: 0, visibility: "hidden" }}
                        transform="translate(195, -200)"
                    >
                        <image
                            href="/images/shipnex-box.svg"
                            x="-36"
                            y="-37.5"
                            width="72"
                            height="75"
                        />
                    </g>
                </svg>
            </div>

            <div className="mx-auto w-full max-w-screen-2xl relative z-10">

                {/* Header */}
                <div className="text-center mb-16 select-none">

                    <h2 className="mt-6 font-bastardo text-[28px] sm:text-[38px] lg:text-[52px] leading-[1.15] tracking-[-0.02em] text-white">
                        Scale without{" "}
                        <br />
                        <span className="text-zinc-400">the surprise bills.</span>
                    </h2>

                    <p className="mt-4 max-w-xl mx-auto text-zinc-400 text-sm sm:text-base leading-relaxed font-medium font-outfit">
                        Start free. Upgrade when your operational fleet expands. No hidden fees.
                    </p>
                </div>

                {/* Monthly / Yearly Billing Toggle Switcher */}
                <div className="flex justify-center items-center gap-3.5 mb-16 select-none">
                    <span className={`text-xs font-bold uppercase tracking-wider transition-all ${billingCycle === "monthly" ? "text-white" : "text-white/50"}`}>
                        Monthly
                    </span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                        className="w-12 h-7 rounded-full bg-white/10 p-1 flex items-center transition-all duration-300 cursor-pointer border border-white/15"
                        aria-label="Billing cycle toggle"
                        role="switch"
                        aria-checked={billingCycle === "yearly"}
                    >
                        <motion.div
                            layout
                            className="w-5 h-5 rounded-full bg-white shadow-md"
                            animate={{ x: billingCycle === "yearly" ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    </button>
                    <span className={`text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-white" : "text-white/50"}`}>
                        Yearly
                        <span className="bg-emerald-500/10 border border-emerald-500/20 text-[#00e5a3] text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Save 20%
                        </span>
                    </span>
                </div>

                {/* Cards Container Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan, i) => {
                        const activePrice = billingCycle === "yearly" ? plan.yearlyPrice : plan.price;
                        const activePeriod = billingCycle === "yearly" ? plan.yearlyPeriod : plan.period;
                        return (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{
                                    duration: 0.6,
                                    delay: i * 0.08,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className={`relative rounded-3xl p-6 lg:p-8 flex flex-col transition-all duration-300 ${plan.highlighted
                                    ? "bg-white text-zinc-950 shadow-2xl scale-[1.01] md:scale-[1.03] border-transparent"
                                    : "border border-white/15 bg-[#0e1b2c] text-white shadow-xl hover:border-white/30 hover:bg-[#122238]"
                                    }`}
                            >
                                {/* Highlight Badge */}
                                {plan.highlighted && (
                                    <div className="absolute -top-3.5 left-6">
                                        <span className="bg-zinc-950 text-white text-[9px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded border border-zinc-800 shadow-md">
                                            FOCUSED OPTION
                                        </span>
                                    </div>
                                )}

                                {/* Plan name */}
                                <p className={`text-[10px] font-mono font-bold tracking-widest uppercase ${plan.highlighted ? "text-zinc-500" : "text-white/60"}`}>
                                    {plan.name}
                                </p>

                                {/* Price block */}
                                <div className="mt-4 mb-2 h-14 flex flex-col justify-center">
                                    <div className="flex items-baseline gap-1">
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={activePrice}
                                                initial={{ y: -6, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: 6, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className={`text-4xl lg:text-5xl font-sans font-light tracking-tight ${plan.highlighted ? "text-zinc-950" : "text-white"}`}
                                            >
                                                {activePrice}
                                            </motion.span>
                                        </AnimatePresence>

                                        {activePeriod && (
                                            <span className={`text-xs font-bold uppercase tracking-wider ${plan.highlighted ? "text-zinc-500" : "text-white/60"}`}>
                                                {activePeriod}
                                            </span>
                                        )}
                                    </div>

                                    {/* Yearly note annotation */}
                                    {billingCycle === "yearly" && plan.yearlyNote && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`text-[9px] font-bold font-mono mt-1 uppercase tracking-wide ${plan.highlighted ? "text-[#059669]" : "text-[#00e5a3]"}`}
                                        >
                                            {plan.yearlyNote}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Description */}
                                <p className={`text-xs leading-relaxed mb-6 mt-2 font-medium font-outfit ${plan.highlighted ? "text-zinc-600" : "text-white/70"}`}>
                                    {plan.description}
                                </p>

                                {/* Divider line */}
                                <div className={`h-px mb-6 ${plan.highlighted ? "bg-zinc-100" : "bg-white/10"}`} />

                                {/* Features list */}
                                <ul className="space-y-3.5 mb-8 flex-1 font-outfit">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className={`flex items-start gap-2.5 text-xs sm:text-[13px] font-normal leading-relaxed tracking-wide ${plan.highlighted ? "text-zinc-700" : "text-zinc-200"}`}
                                        >
                                            <Check
                                                className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlighted ? "text-emerald-500" : "text-[#00e5a3]"}`}
                                            />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <Link
                                    href={plan.href}
                                    className={`w-full text-center py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-250 cursor-pointer ${plan.highlighted
                                        ? "bg-zinc-950 hover:bg-zinc-850 text-white shadow-xl hover:scale-[1.01]"
                                        : "border border-white/20 text-white bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/35 hover:scale-[1.01]"
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
