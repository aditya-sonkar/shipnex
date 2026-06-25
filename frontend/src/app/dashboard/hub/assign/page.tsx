"use client";

import { useState, useEffect } from "react";
import { Package, User, Loader2, CheckCircle2, AlertCircle, ArrowRight, Truck } from "lucide-react";

export default function AssignDeliveryPage() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignments, setAssignments] = useState<{ [shipmentId: string]: string }>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/shipments").then((r) => r.json()),
      fetch("/api/auth/users").then((r) => r.json())
    ])
      .then(([shipmentData, userData]) => {
        if (Array.isArray(shipmentData)) {
          setShipments(shipmentData.filter((s) => s.status === "at_hub"));
        } else if (shipmentData.error) {
          setError(shipmentData.error);
        }

        if (Array.isArray(userData)) {
          setDrivers(userData.filter((u) => u.role === "delivery"));
        } else if (userData.error) {
          if (!error) setError(userData.error);
        }
      })
      .catch(() => setError("Failed to fetch data"))
      .finally(() => setLoading(false));
  }, [error]);

  const handleAssign = async (shipmentId: string) => {
    const driverId = assignments[shipmentId];
    if (!driverId) return;

    setSubmitting(shipmentId);
    try {
      const res = await fetch(`/api/shipments/${shipmentId}/assign-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedDriverId: driverId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Assignment failed");

      // Remove from list
      setShipments((prev) => prev.filter((s) => s.id !== shipmentId));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-zinc-500">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 select-none">
      <div className="border-b border-zinc-200/40 dark:border-zinc-800/40 pb-5">
        <h2 className="font-heading font-light text-3xl tracking-tight text-foreground flex items-center gap-3">
          <Truck className="text-zinc-400" />
          Assign Delivery Drivers
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
          Select packages that are currently in the hub and assign them to an active delivery partner for dispatch.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 text-sm flex items-center gap-2">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {shipments.length === 0 ? (
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-12 text-center">
          <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-4" />
          <h3 className="text-xl font-heading text-foreground mb-2">No pending assignments</h3>
          <p className="text-sm text-zinc-500">All scanned packages have been assigned to drivers.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {shipments.map((shipment) => (
            <div key={shipment.id} className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl text-zinc-500">
                  <Package size={20} />
                </div>
                <div>
                  <p className="font-bold font-mono text-sm">{shipment.trackingNumber}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 max-w-sm truncate">
                    To: {shipment.receiverAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={14} className="text-zinc-400" />
                  </span>
                  <select
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none appearance-none"
                    value={assignments[shipment.id] || ""}
                    onChange={(e) => setAssignments({ ...assignments, [shipment.id]: e.target.value })}
                  >
                    <option value="" disabled>Select Driver</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>{d.fullName}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => handleAssign(shipment.id)}
                  disabled={!assignments[shipment.id] || submitting === shipment.id}
                  className="px-5 py-2.5 bg-foreground text-background font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {submitting === shipment.id ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                  Assign
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
