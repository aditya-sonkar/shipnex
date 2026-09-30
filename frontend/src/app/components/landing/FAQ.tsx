"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "Is tracking actually real-time?",
            answer: "Yes. Every barcode swipe, hub transfer, and delivery dispatch event triggers a status update broadcasted to subscribers instantly.",
        },
        {
            question: "Who is ShipNex built for?",
            answer: "From fast-growing regional courier networks and e-commerce logistics operations to enterprise supply chain managers needing multi-tenant hub isolation.",
        },
        {
            question: "How many shipments can ShipNex handle?",
            answer: "ShipNex is built on Next.js, Express, MongoDB, and Redis caching. It's built to handle millions of active consignments and high-concurrency requests.",
        },
        {
            question: "Can ShipNex teleport my shipments?",
            answer: "Not yet. We're still waiting for quantum mechanics and physics to approve that update. Until then, our route optimization keeps transit times fast.",
        },
    ];

    return (
        <section id="faq" className="mx-auto w-full max-w-screen-2xl px-8 lg:px-16 py-12 lg:py-20 relative select-none">
            {/* Background grid line helper */}
            <div className="absolute inset-x-0 top-0 h-px bg-zinc-200/50 dark:bg-zinc-800/40" />

            {/* Centered Header */}
            <div className="text-center mb-16 select-none">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-550 block mb-3">
                    SUPPORT DESK
                </span>
                <h2 className="font-heading font-light text-zinc-900 dark:text-white text-[28px] sm:text-[38px] lg:text-[52px] leading-[1.15] tracking-[-0.03em]">
                    Frequently Asked Questions
                </h2>
            </div>

            {/* Centered Minimal Accordion */}
            <div className="max-w-3xl mx-auto divide-y divide-zinc-250/60 dark:divide-zinc-900/60">
                {faqs.map((faq, i) => (
                    <div
                        key={faq.question}
                        className="first:pt-0 pt-5 pb-5"
                    >
                        <button 
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            aria-expanded={openIndex === i}
                            className="w-full flex items-center justify-between text-left cursor-pointer select-none group"
                        >
                            <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                                {faq.question}
                            </span>
                            <span className={`shrink-0 ml-8 text-zinc-455 dark:text-zinc-650 transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`}>
                                <Plus className="h-4.5 w-4.5" />
                            </span>
                        </button>
                        <AnimatePresence initial={false}>
                            {openIndex === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden"
                                >
                                    <p className="pt-3 text-[12.5px] text-zinc-550 dark:text-zinc-455 leading-relaxed max-w-xl">
                                        {faq.answer}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    );
}