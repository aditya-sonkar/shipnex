"use client";

import {
  CreditCard,
  Download,
  FileText,
  CheckCircle2,
  Zap,
  Shield,
  Users,
} from "lucide-react";

export default function BillingPage() {
  return (
    <>
      {/* Current Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-foreground">Current Plan</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border border-violet-200/50 dark:border-violet-800/50">Active</span>
          </div>
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-4xl font-heading font-light text-foreground">$299</span>
            <span className="text-sm text-zinc-400">/month</span>
          </div>
          <p className="text-xs text-zinc-500 mb-5">Business Plan · Renews Jul 1, 2026</p>
          <div className="space-y-2">
            {["Unlimited shipments", "Up to 50 hubs", "100 team members", "Priority support"].map((f) => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Payment Method</h2>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/30 dark:border-zinc-800/30">
            <div className="w-12 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-500 flex items-center justify-center shrink-0">
              <CreditCard size={16} className="text-white dark:text-zinc-900" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">•••• •••• •••• 4242</p>
              <p className="text-xs text-zinc-500">Visa · Expires 12/2028</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">Default</span>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-900">
          <h2 className="text-sm font-semibold text-foreground">Invoice History</h2>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {[
            { id: "INV-2026-06", date: "Jun 1, 2026", amount: "$299.00" },
            { id: "INV-2026-05", date: "May 1, 2026", amount: "$299.00" },
            { id: "INV-2026-04", date: "Apr 1, 2026", amount: "$299.00" },
          ].map((inv) => (
            <div key={inv.id} className="flex items-center gap-4 px-5 sm:px-6 py-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
              <FileText size={14} className="text-zinc-400 shrink-0" />
              <p className="text-sm font-medium text-foreground font-mono flex-1">{inv.id}</p>
              <p className="text-xs text-zinc-400 hidden sm:block">{inv.date}</p>
              <p className="text-sm font-medium text-foreground">{inv.amount}</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                <CheckCircle2 size={9} /> paid
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
