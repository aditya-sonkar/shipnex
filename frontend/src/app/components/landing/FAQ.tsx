"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "Is tracking actually real-time?",
            answer: "Yes. Shipment statuses update instantly as they move through hubs and delivery checkpoints.",
        },
        {
            question: "Who is ShipNex built for",
            answer: "From fast-growing e-commerce brands to enterprise logistics teams, ShipNex scales with your operations.",
        },
        {
            question: "How many shipments can ShipNex handle?",
            answer: "Whether you're managing hundreds or millions of shipments, ShipNex is built to grow with you."
        },
        {
            question: "Can ShipNex teleport my shipments?",
            answer: "Not yet. We're still waiting for physics to approve the feature."
        },
    ];

    return (
        <section id="faq" className="px-8 lg:px-16 py-16 lg:py-24">
            <div className="w-full max-w-screen-2xl mx-auto text-center">
                {/* Header */}
                <div className="mb-14 select-none">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="font-heading font-light text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] tracking-[-0.02em] leading-[1.15] text-foreground">
                        Frequently Asked
                        <br />
                        <span className="text-zinc-400 dark:text-zinc-400">questions.</span>
                    </motion.h2>
                </div>

                {/* According list */}
                <div className="max-w-3xl mx-auto">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={faq.question}
                            initial={{ opacity: 0, y: 0 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.06 }}
                            className="border-b border-zinc-200/60 dark:border-zinc-800/50"
                        >
                            <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between py-5 text-left cursor-pointer select-none group"
                            >
                                <span className="text-[15px] sm:text-base font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-foreground transition-colors">
                                    {faq.question}
                                </span>
                                <span className={`shrink-0 ml-8 text-zinc-400 transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`}>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
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
                                        <p className="pb-5 text-sm text-left text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}

                </div>
            </div>
        </section>
    );
}