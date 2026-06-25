"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Features() {
  const cards = [
    {
      id: "manifests",
      title: "Hub Package Intake",
      image: "/images/data_ingestion.png",
      tags: ["BARCODE SCANNING", "HUB LOGISTICS", "INSTANT LOGGING"],
      description: "Hub managers can use any device camera to instantly scan incoming packages, verify their destination, and automatically log them into the facility's inventory.",
    },
    {
      id: "routing",
      title: "Live Shipment Routing",
      image: "/images/spatial_routing.png",
      tags: ["PREDICTIVE ETA", "LIVE TRACKING", "ROUTE MAPPING"],
      description: "Company administrators can track active consignments on a live dashboard, dynamically estimating delivery times and viewing real-time status updates.",
    },
    {
      id: "federation",
      title: "Delivery Fleet App",
      image: "/images/global_fleets.png",
      tags: ["ROUTE QUEUES", "DRIVER ASSIGNMENT", "PROOF OF DELIVERY"],
      description: "Drivers receive optimized daily route queues on their mobile devices, allowing them to mark drops as completed and instantly upload photo proof of delivery.",
    }
  ];

  return (
    <section id="features" className="px-8 lg:px-16 pt-20 pb-10 lg:pt-32 lg:pb-12 relative">
      <div className="mx-auto w-full max-w-screen-2xl">

        {/* Header Section */}
        <div className="max-w-2xl mb-12">
          <h2 className="font-heading font-light text-foreground text-[40px] lg:text-[56px] leading-[1.1] tracking-[-0.02em]">
            Platform Ecosystem
          </h2>
          <p className="mt-6 text-sm lg:text-base text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed text-pretty">
            Where multi-modal logic, spatial routing, and global fleet networks come together. Explore in-depth capabilities showcasing how ShipNex powers real-world logistics, and learn how to scale your delivery operations with our APIs.
          </p>
        </div>

        {/* 3-Column Image Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-2xl overflow-hidden bg-zinc-900 aspect-[4/5] sm:aspect-[3/4] flex flex-col justify-between"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient Overlays for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
              </div>

              {/* Top Title */}
              <div className="relative z-10 p-6 lg:p-8  border border-white/15 bg-black/30">
                <h3 className="text-white font-semibold tracking-tight text-lg lg:text-xl">
                  {card.title}
                </h3>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 p-6 lg:p-8 flex flex-col gap-3">
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded bg-white/20 backdrop-blur-md border border-white/10 text-white text-[9px] font-bold tracking-widest uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-200 leading-relaxed font-medium text-pretty mt-1">
                  {card.description}
                </p>

                {/* Explore Link */}
                <Link
                  href="#"
                  className="inline-flex items-center text-xs font-bold text-white hover:text-[#00e5a3] transition-colors mt-2"
                >
                  <span className="border-b border-white/30 group-hover:border-[#00e5a3]/50 pb-0.5">Explore &rarr;</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Centered Button */}
        <div className="mt-16 flex justify-center">
          <Link
            href="#features"
            className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            Explore Ecosystem &rarr;
          </Link>
        </div>

      </div>
    </section>
  );
}