"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Package, MapPin, Calendar, Clock, Truck, ShieldAlert, ArrowLeft, Loader2, Navigation, Compass } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";

interface Event {
  id: string;
  status: string;
  description: string;
  location: string;
  createdAt: string;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  receiverName: string;
  receiverAddress: string;
  weight: number;
  status: string;
  createdAt: string;
  events: Event[];
}

interface Prediction {
  predictedDays: number;
  estimatedDeliveryDate: string;
  confidence: string;
}

export default function PublicTrackerPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const trackingId = resolvedParams.id;

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!trackingId) return;

    fetch(`/api/track/${trackingId}`)
      .then((r) => {
        if (!r.ok) throw new Error("Consignment tracking code not found.");
        return r.json();
      })
      .then((data) => {
        setShipment(data);
        setError("");
        if (data.status !== "delivered" && data.status !== "failed") {
          fetch(`/api/track/${trackingId}/predict`)
            .then(r => r.json())
            .then(predData => {
              if (!predData.error) {
                setPrediction({
                  predictedDays: predData.predictedDays,
                  estimatedDeliveryDate: new Date(predData.estimatedDeliveryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                  confidence: predData.confidence,
                });
              }
            })
            .catch(() => { });
        } else {
          setPrediction(null);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [trackingId]);

  return (
    <main className="min-h-screen w-full flex flex-col justify-between p-6 relative overflow-hidden bg-background text-foreground select-none">
      {/* Spotlights and Ambient Mesh Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_-200px,rgba(42,103,156,0.06),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_700px_at_-100px_300px,rgba(0,229,163,0.03),transparent)] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between z-10 py-4 border-b border-zinc-200/10 mb-8">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-foreground select-none">
          shipnex
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-[13px] font-semibold border border-zinc-200 dark:border-zinc-800 rounded-full px-5 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Portal Login
          </Link>
        </div>
      </header>

      {/* Main Panel */}
      <div className="w-full flex-grow flex flex-col justify-center max-w-4xl mx-auto z-10 space-y-6">
        {loading ? (
          <div className="text-center py-20 space-y-4">
            <Loader2 className="animate-spin text-zinc-500 mx-auto" size={32} />
            <p className="text-sm text-zinc-400">Retrieving manifest timeline...</p>
          </div>
        ) : error ? (
          <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 text-center space-y-4">
            <ShieldAlert size={40} className="text-rose-500 mx-auto animate-pulse" />
            <h2 className="font-heading font-light text-2xl text-foreground">Tracking Resolution Failed</h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              We couldn't locate tracking ID <span className="font-semibold text-foreground">"{trackingId}"</span>. Please check the ID and try again.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground underline hover:opacity-80"
              >
                <ArrowLeft size={12} /> Back to Search
              </Link>
            </div>
          </div>
        ) : shipment ? (
          <div className="space-y-6">
            {/* Shipment Summary Panel */}
            <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm">
              {prediction && shipment.status !== "delivered" && shipment.status !== "failed" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Tracking Number</span>
                      <h2 className="text-2xl font-semibold text-foreground mt-0.5">{shipment.trackingNumber}</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Sender Address</span>
                        <p className="text-sm text-foreground mt-0.5 font-medium">{shipment.senderAddress}</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Recipient Address</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-sm text-foreground font-medium">{shipment.receiverAddress}</p>
                          {shipment.status === "delivered" && (
                            <span className="text-[8px] font-bold px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full lowercase tracking-normal">
                              delivered
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Prediction Box */}
                  <div className="bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/60 rounded-2xl p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                        <Compass size={11} /> AI Delivery Predictor
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-550/10 text-emerald-500">
                        {prediction.confidence} Confidence
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-3xl font-sans font-light text-foreground">{prediction.estimatedDeliveryDate}</p>
                      <p className="text-xs text-zinc-400 mt-1">Calculated arrival date based on parcel logistics metrics.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Tracking Number</span>
                    <h2 className="text-2xl font-semibold text-foreground mt-0.5">{shipment.trackingNumber}</h2>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Sender Address</span>
                    <p className="text-sm text-foreground mt-0.5 font-medium">{shipment.senderAddress}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Recipient Address</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-sm text-foreground font-medium">{shipment.receiverAddress}</p>
                      {shipment.status === "delivered" && (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full lowercase tracking-normal">
                          delivered
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shipment Events Timeline */}
            <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="text-sm font-semibold text-foreground">Timeline History</h3>

              <div className="relative border-l-2 border-zinc-200 dark:border-zinc-800 ml-4 pl-6 space-y-8">
                {shipment.events.map((event, index) => (
                  <div key={event.id} className="relative">
                    {/* Timeline Node Icon indicator */}
                    <span className={`absolute -left-[33px] top-0.5 w-4 h-4 rounded-full border-2 ${index === 0
                        ? "bg-foreground border-foreground animate-ping-subtle"
                        : "bg-background border-zinc-350 dark:border-zinc-700"
                      }`} />

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-foreground capitalize">
                          {event.status.replace(/_/g, " ")}
                        </h4>
                        <span className="text-xs text-zinc-400">
                          {new Date(event.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                          {new Date(event.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-550 dark:text-zinc-400">
                        {event.description}
                      </p>
                      {event.location && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 mt-1">
                          <MapPin size={9} /> {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-[11px] text-zinc-550 z-10 py-8 mt-12 border-t border-zinc-200/10">
        © {new Date().getFullYear()} ShipNex Inc. All rights reserved.
      </footer>
    </main>
  );
}
