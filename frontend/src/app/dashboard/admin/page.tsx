"use client";

import { Package, Users, Warehouse, TrendingUp, PlusCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboardSkeleton() {
  const [metrics, setMetrics] = useState({
    activeConsignments: 0,
    registeredTeam: 0,
    activeHubs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/shipments/metrics")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setMetrics(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Page Header Segment */}
      <div className="border-b border-zinc-200/40 dark:border-zinc-800/40 pb-5">
        <h2 className="font-heading font-light text-3xl tracking-tight text-foreground">
          Company Operations Control
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
          Manage system configurations, register dispatch hubs, onboard field agents, and inspect global cargo statistics.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Consignments", value: metrics.activeConsignments, change: "Live", icon: Package },
          { label: "Registered Operators", value: metrics.registeredTeam, change: "Live", icon: Users },
          { label: "Active Dispatch Hubs", value: metrics.activeHubs, change: "Live", icon: Warehouse },
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
                <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">
                  {item.change}
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

      {/* Quick Action Matrix */}
      <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Operational Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/dashboard/admin/create"
            className="flex items-center justify-between p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <PlusCircle size={16} className="text-zinc-500" />
              <div>
                <p className="text-sm font-medium text-foreground">Book New Shipment</p>
                <p className="text-xs text-zinc-450 dark:text-zinc-550">Instantly generate consignment orders</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-zinc-400 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/dashboard/admin/team"
            className="flex items-center justify-between p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Users size={16} className="text-zinc-500" />
              <div>
                <p className="text-sm font-medium text-foreground">Register Team Members</p>
                <p className="text-xs text-zinc-450 dark:text-zinc-550">Onboard Hub Managers & Couriers</p>
              </div>
            </div>
            <ArrowRight size={14} className="text-zinc-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}