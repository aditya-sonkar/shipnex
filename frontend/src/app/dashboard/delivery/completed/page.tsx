"use client";

import { useState, useEffect } from "react";
import { Package, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CompletedDeliveriesPage() {
  const [completedStops, setCompletedStops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/shipments/mine")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch route");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setCompletedStops(data.filter((s: any) => s.status === "delivered"));
        } else {
          setError("Failed to load data.");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20 select-none">
      <div className="flex items-center justify-between border-b border-zinc-200/40 dark:border-zinc-800/40 pb-5">
        <h2 className="font-heading font-light text-2xl tracking-tight text-foreground flex items-center gap-2">
          <CheckCircle2 className="text-emerald-500" size={24} />
          Completed
        </h2>
        <Link
          href="/dashboard/delivery"
          className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-zinc-500">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      ) : completedStops.length === 0 ? (
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-10 text-center space-y-3">
          <Package size={36} className="text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h3 className="font-heading font-light text-xl text-foreground">No Completed Deliveries</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            You have not completed any deliveries today.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {completedStops.map((stop) => (
            <div
              key={stop.id}
              className="bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/10 rounded-2xl p-5 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 uppercase tracking-widest">
                  Delivered
                </span>
                <span className="font-mono text-[10px] text-zinc-400">{stop.trackingNumber}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{stop.receiverAddress}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">Delivered to: {stop.receiverName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
