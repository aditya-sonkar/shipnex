"use client";

import { Boxes, ScanLine, Truck, ArrowDownToLine, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HubDashboardSkeleton() {
  const [metrics, setMetrics] = useState({
    incoming: 0,
    sorting: 0,
    dispatched: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shipments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const incoming = data.filter((s) => s.status === "pending" || s.status === "in_transit" || s.status === "picked_up").length;
          const sorting = data.filter((s) => s.status === "at_hub" || s.status === "at_sorting").length;
          const dispatched = data.filter((s) => s.status === "out_for_delivery").length;
          setMetrics({ incoming, sorting, dispatched });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page Header Segment */}
      <div className="border-b border-zinc-200/40 dark:border-zinc-800/40 pb-5">
        <h2 className="font-heading font-light text-3xl tracking-tight text-foreground">
          Sorting Facility Operations
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
          Manage local package manifests, route sorted items to vehicles, and operate barcode scanning systems.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Incoming Manifests", value: metrics.incoming, details: "Live tracking", icon: ArrowDownToLine },
          { label: "Items in Sorting Queue", value: metrics.sorting, details: "Facility count", icon: Boxes },
          { label: "Dispatched Drivers", value: metrics.dispatched, details: "Out for delivery", icon: Truck },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 hover:shadow-md hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-350"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-zinc-150 dark:bg-zinc-900 border border-zinc-200/40 dark:border-zinc-800/40 text-zinc-650 dark:text-zinc-400">
                  <Icon size={16} />
                </div>
                <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">
                  {item.details}
                </span>
              </div>
              <p className="text-3xl font-heading font-light text-foreground tracking-tight">
                {loading ? "..." : item.value}
              </p>
              <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mt-1">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Scanning Panel Hook */}
      <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Facility Barcode Manifests</h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Scan incoming containers to load inventory lanes</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/hub/assign"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-foreground text-xs font-bold uppercase tracking-wider hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
            >
              Assign Drivers
            </Link>
            <Link
              href="/dashboard/hub/scan"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all"
            >
              <ScanLine size={13} />
              Open Scanner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
