"use client";

import { useState, useEffect } from "react";
import {
  Warehouse,
  MapPin,
  PlusCircle,
  Loader2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

interface Hub {
  id: string;
  name: string;
  address: string;
  createdAt: string;
}

export default function HubsPage() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const fetchHubs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hubs");
      if (res.ok) setHubs(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHubs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) return;
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/hubs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, address }),
      });
      const data = await res.json();
      if (res.ok) {
        setHubs((prev) => [data, ...prev]);
        setName("");
        setAddress("");
        setShowForm(false);
        setMsg({ ok: true, text: `Hub "${data.name}" created successfully.` });
        setTimeout(() => setMsg(null), 3000);
      } else {
        setMsg({ ok: false, text: data.error || "Failed to create hub." });
      }
    } catch {
      setMsg({ ok: false, text: "Network error." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (hub: Hub) => {
    if (!confirm(`Delete "${hub.name}"? This cannot be undone.`)) return;
    setDeletingId(hub.id);
    try {
      const res = await fetch(`/api/hubs/${hub.id}`, { method: "DELETE" });
      if (res.ok) {
        setHubs((prev) => prev.filter((h) => h.id !== hub.id));
        setMsg({ ok: true, text: `Hub "${hub.name}" deleted.` });
        setTimeout(() => setMsg(null), 3000);
      } else {
        const data = await res.json();
        setMsg({ ok: false, text: data.error || "Failed to delete hub." });
      }
    } catch {
      setMsg({ ok: false, text: "Network error." });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-heading font-light text-2xl tracking-tight text-foreground">
            Hub Management
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Create and manage your sorting and distribution hubs.
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setMsg(null); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
        >
          {showForm ? <X size={14} /> : <PlusCircle size={14} />}
          {showForm ? "Cancel" : "Add Hub"}
        </button>
      </div>

      {/* Notification */}
      {msg && (
        <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${msg.ok ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400"}`}>
          {msg.ok ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          {msg.text}
        </div>
      )}

      {/* Add Hub Form */}
      {showForm && (
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Register New Hub</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Hub Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. North Delhi Sorting Hub"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 12 Industrial Road, Delhi"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-60 cursor-pointer"
              >
                {submitting ? <Loader2 size={13} className="animate-spin" /> : <PlusCircle size={13} />}
                {submitting ? "Creating…" : "Create Hub"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Hubs", value: hubs.length, color: "text-violet-500" },
          { label: "Active", value: hubs.length, color: "text-emerald-500" },
          { label: "Inactive", value: 0, color: "text-rose-500" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 text-center"
          >
            <p className={`text-3xl font-sans font-light ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Hub Cards */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-zinc-400">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Loading hubs…</span>
        </div>
      ) : hubs.length === 0 ? (
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-12 text-center space-y-3">
          <Warehouse size={36} className="text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h3 className="font-heading font-light text-xl text-foreground">No Hubs Yet</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Create your first distribution hub to start routing shipments.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mx-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
          >
            <PlusCircle size={13} /> Add First Hub
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hubs.map((hub) => (
            <div
              key={hub.id}
              className="group bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-lg relative"
            >
              {/* Delete button */}
              <button
                onClick={() => handleDelete(hub)}
                disabled={deletingId === hub.id}
                className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-zinc-400 hover:text-rose-500 transition-all disabled:opacity-60"
                title="Delete hub"
              >
                {deletingId === hub.id ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
                  <Warehouse size={16} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground pr-6">{hub.name}</p>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 mb-3">
                <MapPin size={12} className="text-zinc-400 mt-0.5 shrink-0" />
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{hub.address}</p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900">
                <p className="text-[10px] text-zinc-400">
                  Created {new Date(hub.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
