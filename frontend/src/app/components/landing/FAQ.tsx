"use client";

import { useState, useRef } from "react";
import { CornerDownRight, Minus, Plus } from "lucide-react";
import { useSectionReveal } from "./useSectionReveal";

const BRAND = "shipnex";

const faqs = [
    {
        question: `How do I get a shipping quote from ${BRAND}?`,
        answer: "Click “Get a Quote”, share your pickup and delivery locations, cargo type and weight, and our team will send you a detailed quote within one business day."
    },
    {
        question: `What types of cargo does ${BRAND} handle?`,
        answer: "We handle general goods, commercial shipments, perishables, and oversized cargo, across sea, air, and road routes worldwide."
    },
    {
        question: "How long does international shipping take?",
        answer: "Air freight usually takes 3 to 7 days, sea freight 15 to 45 days depending on the route, and road freight depends on distance and border clearance."
    },
    {
        question: "Can I track my shipment in real time?",
        answer: "Yes. Every shipment gets a tracking ID, and you can follow its status and location live from your dashboard or through email updates."
    },
    {
        question: "Who handles customs clearance?",
        answer: "Our customs team prepares the documents and manages clearance at origin and destination, so your cargo doesn't get held up at the border."
    },
    {
        question: "What if my shipment is delayed?",
        answer: "We notify you right away, explain the cause, and share a revised delivery estimate. Our support team works to get things moving again as fast as possible."
    },
    {
        question: "Is my cargo insured during transit?",
        answer: "Basic liability cover is included, and we offer full-value cargo insurance as an add-on for extra protection."
    },
    {
        question: `How do I get started with ${BRAND}?`,
        answer: "Send us a quote request or contact our team. We’ll review your needs, suggest the best route and mode, and handle the rest from pickup to delivery."
    },
];
export default function FAQ() {

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const tagRef = useRef<HTMLSpanElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const itemsRef = useRef<HTMLDivElement>(null);
    useSectionReveal({ sectionRef, tagRef, headingRef, descRef, itemsRef });

    return (
        <section id="faq" ref={sectionRef} className="overflow-hidden bg-white px-4 py-8 text-black sm:px-8 md:px-10 lg:px-12 lg:py-10">
            <div className="mx-auto w-full max-w-[1720px]">
                <div>
                    <span
                        ref={tagRef}
                        className="mb-4 sm:mb-6 lg:mb-8 flex items-center gap-2 text-xs font-medium tracking-wider text-neutral-500 uppercase"
                    >
                        <span className="h-1.5 w-1.5 bg-neutral-500" />
                        FREQUENTLY ASKED QUESTIONS
                    </span>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
                    <div className="flex flex-col justify-between lg:col-span-5">
                        <h2 ref={headingRef} className="max-w-md text-4xl font-semibold leading-[1.03] tracking-[-0.04em] sm:text-5xl lg:text-[clamp(3.25rem,4.2vw,4.5rem)]">
                            Got questions? we’ve got answers.
                        </h2>

                        {/* Desktop CTA (pinned to bottom of left column) */}
                        <div className="hidden lg:block mt-10 lg:mt-0">
                            <p ref={descRef} className="mb-5 max-w-[320px] text-sm lg:text-[15px] leading-relaxed text-neutral-700">
                                Can&apos;t find your answer? No worries, ask our team, and we&apos;ll get back to you right away.
                            </p>
                            <a
                                href="#contact"
                                className="inline-flex items-center gap-2.5 bg-black px-5 py-3 text-xs font-medium tracking-wider text-white uppercase transition-colors hover:bg-neutral-800"
                            >
                                <span
                                    className="h-1.5 w-1.5 bg-white"
                                />
                                ASK QUESTIONS
                                <CornerDownRight className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col lg:col-span-7">
                        <div ref={itemsRef} className="flex flex-col gap-2.5">
                            {faqs.map((faq, i) => {
                                const isOpen = openIndex === i;
                                return (
                                    <div
                                        key={faq.question}
                                        className="border border-neutral-200 bg-white"
                                    >
                                        <button
                                            type="button"
                                            aria-expanded={isOpen}
                                            onClick={() => setOpenIndex(isOpen ? null : i)}
                                            className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 lg:py-5"
                                        >
                                            <span className="text-[15px] lg:text-[clamp(15px,0.8vw+6px,18px)] font-medium text-neutral-900">
                                                {faq.question}
                                            </span>
                                            {isOpen ? (
                                                <Minus className="h-4 w-4 shrink-0 text-neutral-700" />
                                            ) : (
                                                <Plus className="h-4 w-4 shrink-0 text-neutral-700" />
                                            )}
                                        </button>
                                        <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                            <div className="overflow-hidden">
                                                <p className="px-5 pb-4 text-sm lg:text-[clamp(13px,0.75vw+4px,16px)] leading-relaxed text-neutral-500 sm:px-6 sm:pb-5">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Mobile CTA (shown at the end of the FAQ list) */}
                        <div className="mt-8 lg:hidden">
                            <p className="mb-4 max-w-sm text-sm leading-relaxed text-neutral-700">
                                Can&apos;t find your answer? No worries, ask our team, and we&apos;ll get back to you right away.
                            </p>
                            <a
                                href="#contact"
                                className="inline-flex items-center gap-2.5 bg-black px-5 py-3 text-xs font-medium tracking-wider text-white uppercase transition-colors hover:bg-neutral-800"
                            >
                                <span className="h-1.5 w-1.5 bg-white" />
                                ASK QUESTIONS
                                <CornerDownRight className="h-3.5 w-3.5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}