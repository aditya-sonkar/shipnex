"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function TrackPage() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = trackingId.trim().toUpperCase();
    if (!trimmed) {
      setError("Please enter a tracking number.");
      return;
    }
    if (!trimmed.startsWith("SX-") && trimmed.length < 3) {
      setError("Enter a valid ShipNex tracking number (e.g. SX-12345).");
      return;
    }
    router.push(`/track/${trimmed}`);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Brand */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-foreground/5 border border-zinc-200 dark:border-zinc-800 mx-auto">
            <Package size={28} className="text-foreground" />
          </div>
          <h1 className="font-heading font-light text-4xl tracking-tight text-foreground">
            shipnex
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Track your parcel in real time. Enter your tracking number below.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              type="text"
              value={trackingId}
              onChange={(e) => {
                setTrackingId(e.target.value);
                setError("");
              }}
              placeholder="e.g. SX-12345"
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-foreground text-sm font-mono placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-700 transition-all shadow-sm"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs text-rose-500 text-left px-1">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-foreground text-background font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            Track Package <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-6 text-xs text-zinc-400">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/login" className="hover:text-foreground transition-colors">
            Staff Login
          </Link>
        </div>
      </div>
    </main>
  );
}
