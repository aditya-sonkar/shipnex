"use client";

import { useState } from "react";
import {
  Users,
  Truck,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Package,
  Search,
  Star,
} from "lucide-react";

const agents = [
  { id: "1", name: "J. Martinez", email: "martinez@shipnex.com", phone: "+1 (312) 555-0142", status: "on_route" as const, route: "Route N-12", done: 18, total: 24, rating: 4.9, vehicle: "V-023" },
  { id: "2", name: "S. Patel", email: "patel@shipnex.com", phone: "+1 (312) 555-0198", status: "on_route" as const, route: "Route N-15", done: 14, total: 34, rating: 4.8, vehicle: "V-011" },
  { id: "3", name: "K. Lee", email: "lee@shipnex.com", phone: "+1 (312) 555-0167", status: "at_hub" as const, route: "—", done: 19, total: 19, rating: 4.7, vehicle: "V-007" },
  { id: "4", name: "M. Chen", email: "chen@shipnex.com", phone: "+1 (312) 555-0189", status: "on_route" as const, route: "Route S-21", done: 10, total: 22, rating: 4.9, vehicle: "V-019" },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; color: string; dot: string }> = {
    on_route: { label: "On Route", color: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50", dot: "bg-blue-500 animate-pulse" },
    at_hub: { label: "At Hub", color: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50", dot: "bg-emerald-500" },
  };
  const c = config[status] || config.at_hub;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${c.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 text-center">
          <p className="text-3xl font-heading font-light text-foreground">{agents.length}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium uppercase tracking-wider">Total</p>
        </div>
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 text-center">
          <p className="text-3xl font-heading font-light text-blue-600 dark:text-blue-400">{agents.filter(a => a.status === "on_route").length}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium uppercase tracking-wider">On Route</p>
        </div>
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 text-center">
          <p className="text-3xl font-heading font-light text-emerald-600 dark:text-emerald-400">{agents.filter(a => a.status === "at_hub").length}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium uppercase tracking-wider">At Hub</p>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-lg cursor-pointer"
            onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-zinc-500">{agent.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{agent.name}</p>
                <StatusBadge status={agent.status} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-900">
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{agent.route}</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Route</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{agent.done}/{agent.total}</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Delivered</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <p className="text-sm font-semibold text-foreground">{agent.rating}</p>
                </div>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Rating</p>
              </div>
            </div>

            {selectedAgent === agent.id && (
              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-900 space-y-2">
                <div className="flex items-center gap-2">
                  <Truck size={12} className="text-zinc-400" />
                  <p className="text-xs text-zinc-500">Vehicle: <span className="text-foreground font-medium">{agent.vehicle}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-zinc-400" />
                  <p className="text-xs text-zinc-500">{agent.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-zinc-400" />
                  <p className="text-xs text-zinc-500">{agent.phone}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
