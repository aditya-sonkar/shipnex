"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

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
        <section id="pricing" className="px-8 lg:px-16 pt-10 pb-20 lg:pt-12 lg:pb-32 relative">
            <div className="mx-auto w-full max-w-screen-2xl">
                
                {/* Header */}
                <div className="text-center mb-16 select-none">
                    
                    <h2 className="mt-6 font-heading font-light text-foreground text-pretty lg:text-[64px] text-[40px] leading-[1.1] tracking-[-0.02em]">
                        Scale without
                        <br />
                        <span className="text-zinc-400 dark:text-zinc-500">the surprise bills.</span>
                    </h2>
                    
                    <p className="mt-4 max-w-xl mx-auto text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed font-medium">
                        Start free. Upgrade when your operational fleet expands. No hidden fees.
                    </p>
                </div>

                {/* Monthly / Yearly Billing Toggle Switcher */}
                <div className="flex justify-center items-center gap-3.5 mb-16 select-none">
                    <span className={`text-xs font-bold uppercase tracking-wider transition-all ${billingCycle === "monthly" ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>
                        Monthly
                    </span>
                    <button 
                        onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                        className="w-12 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 p-1 flex items-center transition-all duration-300 cursor-pointer"
                        aria-label="Billing cycle toggle"
                    >
                        <motion.div
                            layout
                            className="w-5 h-5 rounded-full bg-zinc-950 dark:bg-white shadow"
                            animate={{ x: billingCycle === "yearly" ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    </button>
                    <span className={`text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${billingCycle === "yearly" ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>
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
                                className={`relative rounded-3xl p-6 lg:p-8 flex flex-col border transition-all duration-300 ${
                                    plan.highlighted
                                        ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50/20 dark:bg-zinc-900/30 shadow-xl scale-[1.02]"
                                        : "border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-950/20 hover:border-zinc-300 dark:hover:border-zinc-700"
                                }`}
                            >
                                {/* Highlight Badge */}
                                {plan.highlighted && (
                                    <div className="absolute -top-3.5 left-6">
                                        <span className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[9px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded border border-zinc-800 dark:border-zinc-250 shadow-md">
                                            FOCUSED OPTION
                                        </span>
                                    </div>
                                )}

                                {/* Plan name */}
                                <p className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
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
                                                className="text-4xl lg:text-5xl font-sans font-light tracking-tight text-zinc-900 dark:text-white"
                                            >
                                                {activePrice}
                                            </motion.span>
                                        </AnimatePresence>
                                        
                                        {activePeriod && (
                                            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                                                {activePeriod}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Yearly note annotation */}
                                    {billingCycle === "yearly" && plan.yearlyNote && (
                                        <motion.p 
                                            initial={{ opacity: 0 }} 
                                            animate={{ opacity: 1 }} 
                                            className="text-[9px] font-bold text-[#00e5a3] font-mono mt-1 uppercase tracking-wide"
                                        >
                                            {plan.yearlyNote}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 mt-2 font-medium">
                                    {plan.description}
                                </p>

                                {/* Divider line */}
                                <div className="h-px bg-zinc-200/60 dark:bg-zinc-800/60 mb-6" />

                                {/* Features list */}
                                <ul className="space-y-3.5 mb-8 flex-1">
                                    {plan.features.map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium"
                                        >
                                            <Check
                                                className="w-4 h-4 shrink-0 mt-0.5 text-indigo-500 dark:text-[#00e5a3]"
                                            />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <Link
                                    href={plan.href}
                                    className={`w-full text-center py-3.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-250 cursor-pointer ${
                                        plan.highlighted
                                            ? "bg-zinc-950 dark:bg-white hover:bg-zinc-850 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 shadow-lg hover:scale-[1.01]"
                                            : "border border-zinc-250 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 bg-white/50 dark:bg-zinc-950/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:border-zinc-350 dark:hover:border-zinc-750 hover:scale-[1.01]"
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
