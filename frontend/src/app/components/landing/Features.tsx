"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type Item = {
  tab: string;
  title: string;
  sub: string;
  text: string;
  image: string;
  chips: string[];
};

type Panel = {
  id: string;
  number: string;
  title: string;
  color: string;
  isLight: boolean;
  items: Item[];
};

const panels: Panel[] = [
  {
    id: "tracking",
    number: ".01",
    title: "Real-Time Shipment Tracking",
    color: "#e5e7fc",
    isLight: true,
    items: [
      {
        tab: "Shipment Tracking",
        title: "Real-Time Shipment Tracking",
        sub: "Live Telemetry & Milestone Intelligence",
        text: "ShipNex coordinates continuous real-time tracking across multi-modal delivery corridors. Automated geofence milestones, predictive delay detection, and live status verification give dispatchers complete operational transparency across partner networks.",
        image: "/images/spatial_routing.png",
        chips: [
          "Instant Shipment Status Updates",
          "End-to-End Supply Chain Visibility",
          "Predictive Delay Notifications",
          "Accurate Dynamic ETA Tracking",
          "Customer Portal Transparency",
        ],
      },
    ],
  },
  {
    id: "routing",
    number: ".02",
    title: "Smart Route Optimization",
    color: "#bcc2f7",
    isLight: true,
    items: [
      {
        tab: "Route Optimization",
        title: "Smart Route Optimization",
        sub: "AI Dynamic Corridor Routing",
        text: "Dynamic algorithmic routing models evaluate physical transit conditions, border queues, and weather disruptions to formulate self-healing, cost-optimized delivery corridors across nations.",
        image: "/images/clean_hero_bg.webp",
        chips: [
          "Dynamic Multi-Modal Pathing",
          "Fuel & Mileage Optimization",
          "Real-Time Traffic Rerouting",
          "Customs Clearance Synchronization",
          "Decarbonized Corridor Selection",
        ],
      },
    ],
  },
  {
    id: "intake",
    number: ".03",
    title: "Smart Parcel Intake",
    color: "#9ba4f4",
    isLight: true,
    items: [
      {
        tab: "Parcel Intake",
        title: "Smart Parcel Intake",
        sub: "Dock Ingestion & Digital Logging",
        text: "Scan incoming parcels, verify destinations, and automatically register shipments into your warehouse inventory with sub-second optical scanning and zero-touch digital logging.",
        image: "/images/data_ingestion.png",
        chips: [
          "Sub-Second Optical Intake",
          "Automated Weight Verification",
          "Instant Warehouse Manifest Sync",
          "Damage & Discrepancy Diagnostics",
          "Zero-Touch Automated Dock Logging",
        ],
      },
    ],
  },
  {
    id: "fleet",
    number: ".04",
    title: "Centralized Fleet Control",
    color: "#6a75e8",
    isLight: false,
    items: [
      {
        tab: "Fleet Control",
        title: "Centralized Fleet Control",
        sub: "Autonomous Telemetry & Dispatch",
        text: "Manage drivers, assign high-priority routes, and monitor vehicle telemetry health from a centralized autonomous dispatch dashboard with end-to-end operational control.",
        image: "/images/global_fleets.png",
        chips: [
          "Live Driver Telematics & GPS Stream",
          "Autonomous Load & Route Balancing",
          "Preventative Diagnostic Alerts",
          "Digital Proof of Delivery (e-POD)",
          "Centralized Driver Communication Hub",
        ],
      },
    ],
  },
  {
    id: "customs",
    number: ".05",
    title: "Documents & Compliance",
    color: "#353A95",
    isLight: false,
    items: [
      {
        tab: "Compliance",
        title: "Documents & Compliance",
        sub: "Automated Digital Customs Filing",
        text: "Automate cross-border regulatory compliance, tariff classifications, and single-window digital filing to clear customs hours ahead of port arrivals with zero manual paperwork.",
        image: "/images/warehouse.jpg",
        chips: [
          "Automated HS Code Classification",
          "Single-Window Digital Declarations",
          "Real-Time Customs Port Queues",
          "Duty & Tariff Pre-Calculations",
          "Zero-Friction Border Clearance",
        ],
      },
    ],
  },
];

export default function Features() {
  const [active, setActive] = useState(0);

  const activePanel = panels[active];
  const activeItem = activePanel.items[0];

  return (
    <section
      id="features"
      style={{ backgroundColor: activePanel.color }}
      className="relative z-20 w-full transition-colors duration-500 ease-out overflow-hidden select-none"
    >
      {/* Desktop horizontal accordion */}
      <div className="hidden md:flex w-full min-h-[720px] lg:min-h-[780px] xl:min-h-[820px] items-stretch overflow-hidden">
        {panels.map((p, idx) => {
          const isActive = idx === active;

          return (
            <div
              key={p.id}
              onClick={() => setActive(idx)}
              style={{
                backgroundColor: p.color,
                width: isActive ? "calc(100% - 320px)" : "80px",
                flexShrink: 0,
                transition: "width 550ms cubic-bezier(0.16, 1, 0.3, 1), background-color 500ms ease",
              }}
              className={`self-stretch relative overflow-hidden select-none ${
                isActive
                  ? "cursor-default"
                  : "cursor-pointer hover:brightness-105 border-x border-black/5"
              }`}
            >
              {isActive ? (
                /* Active panel content */
                <motion.div
                  key={`content-${p.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.18, ease: "easeOut" }}
                  className="w-full h-full overflow-y-auto no-scrollbar py-10 lg:py-14 px-8 sm:px-12 lg:px-16 xl:px-20 min-w-[650px] lg:min-w-[800px]"
                >
                  <div className="max-w-4xl mx-auto flex flex-col">
                    <h2
                      className={`font-gangster font-extrabold tracking-[-0.03em] text-3xl sm:text-4xl lg:text-[40px] leading-tight mb-6 lg:mb-8 ${
                        p.isLight ? "text-zinc-950" : "text-white"
                      }`}
                    >
                      {p.number} {p.title}
                    </h2>

                    <div className="w-full relative overflow-hidden rounded-2xl shadow-2xl border border-black/10 bg-zinc-900 mb-6 lg:mb-8">
                      <img
                        src={activeItem.image}
                        alt={activeItem.title}
                        className="w-full max-h-[440px] lg:max-h-[480px] object-cover object-top block"
                      />
                    </div>

                    <p
                      className={`font-outfit text-sm sm:text-base lg:text-[16px] leading-[1.68] font-normal mb-6 max-w-3xl ${
                        p.isLight ? "text-zinc-800" : "text-white/90"
                      }`}
                    >
                      {activeItem.text}
                    </p>

                    <ul className="flex flex-wrap items-center gap-2.5 sm:gap-3 m-0 p-0 list-none">
                      {activeItem.chips.map((chip) => (
                        <li
                          key={chip}
                          className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-[13.5px] font-outfit font-semibold text-zinc-950 bg-[#d0e834] rounded-lg shadow-sm select-none hover:brightness-105 transition-all"
                        >
                          {chip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ) : (
                /* Inactive vertical bar */
                <motion.div
                  key={`strip-${p.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: 0.18 }}
                  className="w-full h-full flex flex-col items-center justify-between py-10 lg:py-14"
                >
                  <span
                    className={`font-gangster font-bold text-lg sm:text-xl lg:text-2xl ${
                      p.isLight ? "text-zinc-950" : "text-white"
                    }`}
                  >
                    {p.number}
                  </span>

                  <span
                    className={`[writing-mode:vertical-rl] font-gangster font-bold text-sm sm:text-base lg:text-lg tracking-tight whitespace-nowrap mt-8 ${
                      p.isLight ? "text-zinc-950" : "text-white"
                    }`}
                  >
                    {p.title}
                  </span>

                  <span
                    className={`w-2 h-2 rounded-full ${
                      p.isLight ? "bg-zinc-900/30" : "bg-white/40"
                    }`}
                  />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile view */}
      <div
        style={{ backgroundColor: activePanel.color }}
        className="md:hidden w-full transition-colors duration-300 ease-out"
      >
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pt-6 pb-3 border-b border-black/5">
          {panels.map((p, idx) => {
            const isSelected = idx === active;
            return (
              <button
                key={p.id}
                onClick={() => setActive(idx)}
                style={{ backgroundColor: p.color }}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-gangster font-bold transition-all shadow-sm ${
                  p.isLight ? "text-zinc-950" : "text-white"
                } ${isSelected ? "ring-2 ring-zinc-950 scale-105 font-extrabold" : "opacity-80"}`}
              >
                {p.number}
              </button>
            );
          })}
        </div>

        <div className="px-5 py-8">
          <h2
            className={`font-gangster font-extrabold tracking-[-0.03em] text-2xl sm:text-3xl leading-tight mb-6 ${
              activePanel.isLight ? "text-zinc-950" : "text-white"
            }`}
          >
            {activePanel.number} {activePanel.title}
          </h2>

          <div className="w-full relative overflow-hidden rounded-xl shadow-lg border border-black/5 mb-6">
            <img
              src={activeItem.image}
              alt={activeItem.title}
              className="w-full aspect-[4/3] object-cover block"
            />
          </div>

          <p
            className={`font-outfit text-sm leading-relaxed mb-6 ${
              activePanel.isLight ? "text-zinc-800" : "text-white/90"
            }`}
          >
            {activeItem.text}
          </p>

          <ul className="flex flex-wrap items-center gap-2 m-0 p-0 list-none">
            {activeItem.chips.map((chip) => (
              <li
                key={chip}
                className="px-3.5 py-1.5 text-xs font-outfit font-semibold text-zinc-950 bg-[#d0e834] rounded-lg shadow-sm"
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
