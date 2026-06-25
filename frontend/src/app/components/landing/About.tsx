"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function About() {
  return (
    <section className="mx-auto w-full max-w-screen-2xl px-8 lg:px-16 py-12 lg:py-20 relative select-none">
      {/* Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        
        {/* Left Side: Rich Visual Graphics Card */}
        <div className="lg:col-span-5 relative w-full min-h-[400px] lg:min-h-[500px] rounded-[32px] overflow-hidden border border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-100 dark:bg-zinc-950 shadow-md">
          <Image
            src="/logistics_about.png"
            alt="ShipNex Logistics Spatial Intelligence Illustration"
            fill
            className="object-cover transition-transform duration-700 hover:scale-102"
            priority
          />
          {/* Subtle Ambient Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Right Side: Large Bold Information Card */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900/60 border border-zinc-250/50 dark:border-zinc-800/45 rounded-[32px] p-8 sm:p-12 lg:p-16 shadow-lg flex flex-col justify-center text-left">
          
          <h2 className="font-heading text-foreground text-pretty lg:text-[60px] text-[38px] leading-[1.2] tracking-[-0.05em]">
            Logistics intelligence transforms routing into optimization, tracking into reasoning, and dispatching into automation.
          </h2>

          <p className="mt-6 text-sm sm:text-[15px] text-zinc-550 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl">
            ShipNex is a leading logistics intelligence company, building frontier software and coordinate routing models that can perceive, schedule, sort, and automate cargo transit through global physical networks.
          </p>

          <div className="mt-8">
            <Link
              href="#features"
              className="inline-flex items-center gap-2 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-950 px-6 py-3 rounded-full text-xs font-semibold leading-none transition-all duration-200 shadow-md active:scale-98 cursor-pointer group"
            >
              Learn more about us
              <span className="w-5 h-5 rounded-full bg-white/10 dark:bg-zinc-900/10 flex items-center justify-center text-white dark:text-zinc-950 group-hover:translate-x-0.5 transition-transform">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
