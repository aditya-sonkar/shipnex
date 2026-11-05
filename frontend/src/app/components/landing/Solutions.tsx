"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

interface Solution {
    id: string;
    number: string;
    tabTitle: string;
    headline: string;
    tag: string;
    subtitle: string;
    description: string;
    image: string;
    chips: string[];
}

const solutions: Solution[] = [
    {
        id: "intl-trade",
        number: ".01",
        tabTitle: "International Trade",
        headline: "High-Velocity Cargo",
        tag: "AIR & OCEAN FREIGHT",
        subtitle: "Smarter logistics. Stronger global connections.",
        description:
            "We move high-value and time-critical cargo with speed and care. From diverse segments including Apparel, Pharma to Whitegoods & Electronics, our air & ocean freight solutions ensure faster customs, reliable schedules, and complete control from first mile to final delivery.",
        image: "/images/port-crisp.webp",
        chips: [
            "Global Reach Across 5 Continents",
            "Customs Cleared, Fast-Tracked",
            "Sensitive Cargo Handled with Care",
            "Priority Uplifts & Reliable Schedules",
            "First & Last Mile Precision",
        ],
    },
    {
        id: "distribution",
        number: ".02",
        tabTitle: "Distribution",
        headline: "Intelligent Distributed Hubs",
        tag: "WAREHOUSING & FULFILLMENT",
        subtitle: "Strategic positioning. Rapid regional fulfillment.",
        description:
            "Scale your footprint across regional consolidation centers without fixed overhead. Sub-second picking, dynamic slotting, and automated inventory reconciliation keep your regional supply chain fast, agile, and cost-efficient.",
        image: "/images/warehouse.jpg",
        chips: [
            "Strategic Metro Hubs",
            "Sub-Second Optical Intake",
            "Dynamic Slotting Engine",
            "Same-Day Dispatch Pipelines",
            "Consolidated Cross-Docking",
        ],
    },
    {
        id: "customs",
        number: ".03",
        tabTitle: "Customs Clearance",
        headline: "Zero-Friction Cross-Border",
        tag: "DIGITAL BROKERAGE & COMPLIANCE",
        subtitle: "Automated filings. Zero demurrage penalties.",
        description:
            "Pre-cleared documentation and electronic tariff classification sync directly with international border authorities. Eliminate demurrage penalties, speed up gate releases, and maintain audit-ready regulatory compliance.",
        image: "/images/data_ingestion.png",
        chips: [
            "Automated HS Code Classification",
            "Pre-Arrival Electronic Filings",
            "Duty & Tax Optimization",
            "Audit-Ready Document Vault",
            "Bonded Storage Ingestion",
        ],
    },
    {
        id: "my-hub",
        number: ".04",
        tabTitle: "My Hub",
        headline: "Single-Pane Control Tower",
        tag: "ENTERPRISE TELEMETRY PORTAL",
        subtitle: "Unified orchestration. Proactive exception control.",
        description:
            "Access end-to-end logistics telemetry from a single autonomous dashboard. Monitor live GPS coordinates, inspect freight manifest health, and resolve delivery corridor bottlenecks before they impact customer SLAs.",
        image: "/images/Real_time_shipment_tracking.jpg",
        chips: [
            "Multi-Modal Corridor Telemetry",
            "Predictive Bottleneck Alerts",
            "Role-Based Multi-Tenant Security",
            "Instant Digital POD Reconciliation",
            "White-Label Consumer Portals",
        ],
    },
];

export default function Solutions() {
    const [activeIdx, setActiveIdx] = useState(0);
    const activeSolution = solutions[activeIdx];

    return (
        <section
            id="solutions"
            className="relative z-20 w-full bg-[#FAF4F0] text-zinc-950 py-16 sm:py-20 lg:py-24 select-none overflow-hidden transition-colors duration-500"
        >
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-14 xl:px-18">
                {/* Header and horizontal category tabs */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-zinc-250/70">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="font-gangster font-bold tracking-[-0.03em] text-xl sm:text-2xl text-[#353A95]">
                                {activeSolution.number}
                            </span>
                            <h2 className="font-gangster font-extrabold tracking-[-0.03em] text-3xl sm:text-4xl lg:text-5xl text-zinc-950 leading-tight">
                                {activeSolution.tabTitle}
                            </h2>
                        </div>
                        <p className="font-outfit text-zinc-600 text-sm sm:text-base mt-2 font-normal leading-relaxed">
                            {activeSolution.subtitle}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar pt-2">
                        {solutions.map((item, idx) => {
                            const isSelected = idx === activeIdx;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveIdx(idx)}
                                    className={`relative pb-3 text-xs sm:text-sm font-outfit font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                                        isSelected ? "text-zinc-950 font-bold" : "text-zinc-500 hover:text-zinc-800"
                                    }`}
                                >
                                    <span>{item.tabTitle}</span>
                                    {isSelected && (
                                        <motion.div
                                            layoutId="solutionActiveTab"
                                            className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#353A95] rounded-full"
                                            transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main solution showcase */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_auto] gap-8 lg:gap-10 xl:gap-14 pt-10 lg:pt-14 items-start">
                    {/* Solution image card */}
                    <div className="w-full">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSolution.id + "-image"}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                className="relative rounded-3xl overflow-hidden shadow-2xl bg-zinc-200 aspect-[4/3] lg:aspect-[1/1] xl:aspect-[5/4] w-full"
                            >
                                <img
                                    src={activeSolution.image}
                                    alt={activeSolution.headline}
                                    className="w-full h-full object-cover block"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Solution details and chips */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSolution.id + "-content"}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col"
                        >
                            <h3 className="font-gangster font-extrabold tracking-[-0.03em] text-2xl sm:text-3xl lg:text-4xl text-zinc-950 leading-tight m-0">
                                {activeSolution.headline}
                            </h3>

                            <div className="flex items-center gap-2.5 mt-2 mb-3">
                                <span className="w-6 h-[2.5px] bg-[#353A95] rounded-full inline-block" />
                                <strong className="font-outfit font-bold text-xs sm:text-sm uppercase tracking-wider text-zinc-700 opacity-90">
                                    {activeSolution.tag}
                                </strong>
                            </div>

                            <p className="mt-2 text-sm sm:text-base leading-[1.6] font-outfit text-zinc-600 max-w-xl mb-7 opacity-85">
                                {activeSolution.description}
                            </p>

                            <ul className="flex flex-row flex-wrap items-start gap-2 sm:gap-2.5 m-0 p-0 list-none mb-8">
                                {activeSolution.chips.map((c) => (
                                    <li
                                        key={c}
                                        className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-[14px] lg:text-[15px] font-medium font-outfit text-[#111] bg-[#d0e834] rounded-sm shadow-sm select-none"
                                    >
                                        {c}
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-2">
                                <a
                                    href="#pricing"
                                    className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-zinc-950 hover:bg-zinc-850 text-white font-outfit font-bold text-xs tracking-wider uppercase transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                >
                                    <span>Explore Solution</span>
                                    <ArrowRight size={14} className="stroke-[2.5]" />
                                </a>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Vertical selector */}
                    <div className="hidden lg:flex flex-col border-l border-zinc-300/80 self-stretch min-w-[190px] xl:min-w-[220px] divide-y divide-zinc-300/80 -my-4 select-none">
                        {solutions.map((item, idx) => {
                            const isCurrent = idx === activeIdx;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveIdx(idx)}
                                    aria-current={isCurrent}
                                    className={`group flex-1 flex flex-col justify-center items-start text-left px-6 xl:px-8 py-6 transition-all duration-300 cursor-pointer ${
                                        isCurrent
                                            ? "bg-[#353A95] text-white shadow-md"
                                            : "bg-transparent hover:bg-black/[0.03] text-zinc-900"
                                    }`}
                                >
                                    <span
                                        className={`font-gangster font-bold tracking-[-0.03em] text-2xl xl:text-3xl select-none transition-colors ${
                                            isCurrent ? "text-white" : "text-zinc-950"
                                        }`}
                                    >
                                        {item.number}
                                    </span>

                                    <span
                                        className={`w-[2.5px] h-6 my-2.5 rounded-full transition-colors ${
                                            isCurrent ? "bg-white" : "bg-zinc-400/60"
                                        }`}
                                    />

                                    <span
                                        className={`font-gangster font-bold tracking-[-0.03em] text-[15px] xl:text-[17px] leading-[1.12] transition-colors ${
                                            isCurrent ? "text-white" : "text-zinc-800"
                                        }`}
                                    >
                                        {item.tabTitle}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Pagination indicator */}
                <div className="mt-14 pt-6 border-t border-zinc-250/70 flex items-center justify-between text-xs font-outfit text-zinc-500">
                    <div className="flex items-center gap-2">
                        {solutions.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIdx(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                                    i === activeIdx ? "w-10 bg-[#353A95]" : "w-4 bg-zinc-300 hover:bg-zinc-400"
                                }`}
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-zinc-400">
                        <span>Scroll to explore</span>
                        <ChevronDown size={14} className="animate-bounce" />
                    </div>
                </div>
            </div>
        </section>
    );
}

