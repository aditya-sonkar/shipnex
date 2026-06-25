"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MapPin,
  CheckCircle2,
  Navigation,
  Package,
  AlertCircle,
  Clock,
  Compass,
  ScanLine,
  XCircle,
  Loader2,
  RefreshCw,
  Phone,
  Upload,
} from "lucide-react";
import QRModal from "@/app/components/QRModal/QRModal";

interface Stop {
  id: string;
  trackingNumber: string;
  address: string;
  recipient: string;
  status: "pending" | "out_for_delivery" | "delivered" | "failed";
  weight: number;
}

export default function DeliveryMobileDashboard() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [useCamera, setUseCamera] = useState(false);
  const [podFile, setPodFile] = useState<File | null>(null);
  const [podTargetId, setPodTargetId] = useState<string | null>(null);
  const [uploadingPod, setUploadingPod] = useState(false);
  const [error, setError] = useState("");
  const scannerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMyRoute = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/shipments/mine");
      if (!res.ok) throw new Error("Failed to fetch route");
      const data = await res.json();
      // Map shipments to Stop format
      setStops(
        data.map((s: any) => ({
          id: s.id,
          trackingNumber: s.trackingNumber,
          address: s.receiverAddress,
          recipient: s.receiverName,
          status: s.status,
          weight: s.weight,
        }))
      );
    } catch {
      setError("Could not load your deliveries. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRoute();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: "delivered" | "failed") => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/shipments/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          description:
            newStatus === "delivered"
              ? "Package successfully delivered to recipient."
              : "Delivery attempt failed. Will reschedule.",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert("Failed to update status: " + (errorData.error || res.statusText));
        return;
      }

      setStops((prev) =>
        prev.map((stop) => (stop.id === id ? { ...stop, status: newStatus } : stop))
      );
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handlePodUpload = async (shipmentId: string) => {
    if (!podFile) return;
    setUploadingPod(true);
    try {
      const formData = new FormData();
      formData.append("pod", podFile);
      const res = await fetch(`/api/shipments/${shipmentId}/upload-pod`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setStops((prev) =>
          prev.map((s) => (s.id === shipmentId ? { ...s, status: "delivered" } : s))
        );
        setPodFile(null);
        setPodTargetId(null);
      }
    } catch {
      // silently fail
    } finally {
      setUploadingPod(false);
    }
  };

  // Camera logic moved to QRModal

  const pendingStops = stops.filter((s) => s.status !== "delivered" && s.status !== "failed");
  const nextStop = pendingStops[0];
  const completedCount = stops.filter((s) => s.status === "delivered" || s.status === "failed").length;

  if (loading) {
    return (
      <div className="max-w-md mx-auto flex items-center justify-center py-24 gap-3 text-zinc-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading your route…</span>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20 select-none">
      {/* Route Progress Header */}
      <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-zinc-500 dark:text-zinc-400" />
            <h2 className="font-heading font-light text-xl text-foreground">My Active Route</h2>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/delivery/completed"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              Completed
            </Link>
            <button
              onClick={fetchMyRoute}
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              title="Refresh route"
            >
              <RefreshCw size={14} className="text-zinc-400" />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {stops.length > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Stops Progress</span>
              <span className="font-medium text-foreground">
                {completedCount} of {stops.length}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-500"
                style={{ width: `${stops.length ? (completedCount / stops.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Next Stop */}
      {stops.length === 0 ? (
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-10 text-center space-y-3">
          <Package size={36} className="text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h3 className="font-heading font-light text-xl text-foreground">No Deliveries Assigned</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            You have no active shipments. Ask your admin to assign deliveries.
          </p>
        </div>
      ) : nextStop ? (
        <div className="bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-350 dark:border-zinc-700/80 rounded-3xl p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <Navigation size={10} /> Next Stop
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Package size={12} /> {nextStop.weight} kg
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="font-heading font-light text-2xl text-foreground leading-snug">
              {nextStop.address}
            </h3>
            <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-medium text-foreground">{nextStop.recipient}</span>
              <span className="font-mono text-xs">{nextStop.trackingNumber}</span>
            </div>
          </div>

          {updating === nextStop.id ? (
            <div className="flex items-center justify-center py-4 gap-2 text-zinc-400">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-xs">Updating status…</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleUpdateStatus(nextStop.id, "delivered")}
                  className="py-4 rounded-2xl bg-foreground text-background font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all cursor-pointer"
                >
                  <CheckCircle2 size={16} />
                  Delivered
                </button>
                <button
                  onClick={() => handleUpdateStatus(nextStop.id, "failed")}
                  className="py-4 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-950/50 active:scale-[0.97] transition-all cursor-pointer"
                >
                  <AlertCircle size={16} />
                  Failed
                </button>
              </div>

              {/* Upload POD */}
              {podTargetId === nextStop.id ? (
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setPodFile(e.target.files?.[0] || null)}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Upload size={14} />
                    {podFile ? podFile.name : "Choose Photo"}
                  </button>
                  {podFile && (
                    <button
                      onClick={() => handlePodUpload(nextStop.id)}
                      disabled={uploadingPod}
                      className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {uploadingPod ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      {uploadingPod ? "Uploading…" : "Submit POD & Confirm Delivered"}
                    </button>
                  )}
                  <button
                    onClick={() => { setPodTargetId(null); setPodFile(null); }}
                    className="w-full py-2 rounded-2xl text-zinc-400 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setUseCamera(true)}
                    className="py-3 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-blue-100 active:scale-[0.97] transition-all cursor-pointer"
                  >
                    <ScanLine size={14} />
                    Scan QR
                  </button>
                  <button
                    onClick={() => setPodTargetId(nextStop.id)}
                    className="py-3 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-100 active:scale-[0.97] transition-all cursor-pointer"
                  >
                    <Upload size={14} />
                    Upload POD
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-8 text-center space-y-3">
          <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
          <h3 className="font-heading font-light text-xl text-foreground">
            All Deliveries Completed!
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            You have finished all assigned drops. Return to the warehouse facility.
          </p>
        </div>
      )}

      {/* Route Queue */}
      {stops.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest pl-2">
            Route Queue
          </h4>
          <div className="space-y-2">
            {stops.map((stop) => (
              <div
                key={stop.id}
                className={`bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl border border-zinc-200/40 dark:border-zinc-800/40 rounded-2xl p-4 flex items-center justify-between gap-3 ${stop.status !== "pending" && stop.status !== "out_for_delivery" ? "opacity-50" : ""
                  }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{stop.address}</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    {stop.recipient} · {stop.trackingNumber}
                  </p>
                </div>
                <div className="shrink-0">
                  {stop.status === "delivered" ? (
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                      Delivered
                    </span>
                  ) : stop.status === "failed" ? (
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                      Failed
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock size={10} /> Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scanner Modal */}
      <QRModal 
        isOpen={useCamera} 
        onClose={() => setUseCamera(false)} 
        onScan={(decodedText) => {
          setUseCamera(false);
          const match = stops.find(
            (s) => s.trackingNumber.toLowerCase() === decodedText.toLowerCase()
          );
          if (match) {
            handleUpdateStatus(match.id, "delivered");
          }
        }} 
        readerId="delivery-reader" 
      />
    </div>
  );
}
