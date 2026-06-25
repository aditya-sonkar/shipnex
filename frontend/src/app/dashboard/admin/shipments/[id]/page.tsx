"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Package,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Truck,
  Warehouse,
  AlertCircle,
  XCircle,
  User,
  MapPin,
  Weight,
  CalendarDays,
  Tag,
  Printer,
  Loader2,
  UserCheck,
  Building2,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface ShipmentEvent {
  id: string;
  status: string;
  description: string;
  location: string | null;
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
  assignedDriverId: string | null;
  assignedHubId: string | null;
  createdAt: string;
  updatedAt: string;
  events: ShipmentEvent[];
}

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface Hub {
  id: string;
  name: string;
  address: string;
}

interface Prediction {
  predictedDays: number;
  estimatedDeliveryDate: string;
  confidence: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<any> }> = {
  pending: { label: "Pending", color: "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400", icon: Clock },
  picked_up: { label: "Picked Up", color: "bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400", icon: Package },
  at_hub: { label: "At Hub", color: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400", icon: Warehouse },
  at_sorting: { label: "At Sorting", color: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400", icon: Warehouse },
  in_transit: { label: "In Transit", color: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400", icon: Truck },
  out_for_delivery: { label: "Out for Delivery", color: "bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400", icon: Truck },
  delivered: { label: "Delivered", color: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  failed: { label: "Failed", color: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400", icon: XCircle },
};

const validStatuses = ["pending", "picked_up", "at_hub", "at_sorting", "in_transit", "out_for_delivery", "delivered", "failed"];

export default function ShipmentDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  // Action states
  const [newStatus, setNewStatus] = useState("");
  const [statusDesc, setStatusDesc] = useState("");
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [selectedDriver, setSelectedDriver] = useState("");
  const [assigningDriver, setAssigningDriver] = useState(false);
  const [driverMsg, setDriverMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [selectedHub, setSelectedHub] = useState("");
  const [assigningHub, setAssigningHub] = useState(false);
  const [hubMsg, setHubMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/shipments/${id}`).then((r) => r.json()),
      fetch("/api/auth/users").then((r) => r.json()),
      fetch("/api/hubs").then((r) => r.json()),
      fetch(`/api/shipments/${id}/predict`).then((r) => r.json()),
    ]).then(([shipmentData, usersData, hubsData, predData]) => {
      setShipment(shipmentData);
      setTeam(Array.isArray(usersData) ? usersData.filter((u: TeamMember) => u.role === "delivery") : []);
      setHubs(Array.isArray(hubsData) ? hubsData : []);
      if (!predData.error) setPrediction(predData);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus) return;
    setStatusSubmitting(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/shipments/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, description: statusDesc }),
      });
      const data = await res.json();
      if (res.ok) {
        setShipment((prev) => prev ? { ...prev, status: newStatus, events: [
          { id: Date.now().toString(), status: newStatus, description: statusDesc || `Status updated to ${newStatus}`, location: null, createdAt: new Date().toISOString() },
          ...prev.events,
        ] } : prev);
        setStatusMsg({ ok: true, text: "Status updated successfully." });
        setNewStatus("");
        setStatusDesc("");
      } else {
        setStatusMsg({ ok: false, text: data.error || "Failed to update." });
      }
    } catch {
      setStatusMsg({ ok: false, text: "Network error." });
    } finally {
      setStatusSubmitting(false);
    }
  };

  const handleAssignDriver = async () => {
    if (!selectedDriver) return;
    setAssigningDriver(true);
    setDriverMsg(null);
    try {
      const res = await fetch(`/api/shipments/${id}/assign-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedDriverId: selectedDriver }),
      });
      const data = await res.json();
      if (res.ok) {
        setShipment((prev) => prev ? { ...prev, assignedDriverId: selectedDriver } : prev);
        setDriverMsg({ ok: true, text: "Driver assigned successfully." });
      } else {
        setDriverMsg({ ok: false, text: data.error || "Failed." });
      }
    } catch {
      setDriverMsg({ ok: false, text: "Network error." });
    } finally {
      setAssigningDriver(false);
    }
  };

  const handleAssignHub = async () => {
    if (!selectedHub) return;
    setAssigningHub(true);
    setHubMsg(null);
    try {
      const res = await fetch(`/api/shipments/${id}/assign-hub`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedHubId: selectedHub }),
      });
      const data = await res.json();
      if (res.ok) {
        setShipment((prev) => prev ? { ...prev, assignedHubId: selectedHub } : prev);
        setHubMsg({ ok: true, text: "Hub assigned successfully." });
      } else {
        setHubMsg({ ok: false, text: data.error || "Failed." });
      }
    } catch {
      setHubMsg({ ok: false, text: "Network error." });
    } finally {
      setAssigningHub(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 gap-3 text-zinc-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading shipment…</span>
      </div>
    );
  }

  if (!shipment || (shipment as any).error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <Package size={36} className="text-zinc-300 dark:text-zinc-700" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Shipment not found.</p>
        <Link
          href="/dashboard/admin/shipments"
          className="text-xs font-medium text-foreground underline underline-offset-4"
        >
          Back to Shipments
        </Link>
      </div>
    );
  }

  const currentStatus = statusConfig[shipment.status] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;
  const assignedDriver = team.find((m) => m.id === shipment.assignedDriverId);
  const assignedHub = hubs.find((h) => h.id === shipment.assignedHubId);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/shipments"
          className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft size={16} className="text-zinc-500" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-heading font-light text-2xl tracking-tight text-foreground">
              Shipment Detail
            </h2>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1 ${currentStatus.color}`}>
              <StatusIcon size={10} />
              {currentStatus.label}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
            {shipment.trackingNumber}
          </p>
        </div>
        <Link
          href={`/dashboard/admin/shipments/${id}/label`}
          target="_blank"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all"
        >
          <Printer size={14} />
          Print Label
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-5">
          {/* Addresses */}
          <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "From (Sender)", name: shipment.senderName, address: shipment.senderAddress, icon: User },
              { label: "To (Recipient)", name: shipment.receiverName, address: shipment.receiverAddress, icon: MapPin },
            ].map((side) => (
              <div key={side.label}>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">{side.label}</p>
                <div className="flex items-start gap-2">
                  <side.icon size={14} className="text-zinc-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{side.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{side.address}</p>
                  </div>
                </div>
              </div>
            ))}

            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Package Weight</p>
              <div className="flex items-center gap-2">
                <Weight size={14} className="text-zinc-400" />
                <p className="text-sm font-semibold text-foreground">{shipment.weight} kg</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Created</p>
              <div className="flex items-center gap-2">
                <CalendarDays size={14} className="text-zinc-400" />
                <p className="text-sm font-semibold text-foreground">
                  {new Date(shipment.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* ETA Prediction */}
          {prediction && (
            <div className="bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 border border-violet-200/50 dark:border-violet-800/50 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/40">
                  <Sparkles size={16} className="text-violet-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                    AI Delivery Prediction
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">
                    Est.{" "}
                    {new Date(prediction.estimatedDeliveryDate).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short",
                    })}
                    {" "}— {prediction.predictedDays} day{prediction.predictedDays !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{prediction.confidence}</p>
                <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Confidence</p>
              </div>
            </div>
          )}

          {/* Event Timeline */}
          <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Tracking Timeline</h3>
            {shipment.events.length === 0 ? (
              <p className="text-xs text-zinc-400">No events recorded yet.</p>
            ) : (
              <div className="relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-zinc-200 dark:bg-zinc-800" />
                <div className="space-y-5">
                  {shipment.events.map((event, i) => {
                    const cfg = statusConfig[event.status] || statusConfig.pending;
                    const EventIcon = cfg.icon;
                    return (
                      <div key={event.id} className="flex gap-4 relative">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${i === 0 ? "border-foreground bg-foreground" : "border-zinc-300 dark:border-zinc-700 bg-background"}`}>
                          <EventIcon size={10} className={i === 0 ? "text-background" : "text-zinc-400"} />
                        </div>
                        <div className="flex-1 min-w-0 pb-1">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-foreground">{cfg.label}</p>
                            <p className="text-[10px] text-zinc-400">
                              {new Date(event.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{event.description}</p>
                          {event.location && (
                            <p className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5">
                              <MapPin size={9} /> {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right col - Actions */}
        <div className="space-y-5">
          {/* Update Status */}
          <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Update Status</h3>
            <form onSubmit={handleStatusUpdate} className="space-y-3">
              {statusMsg && (
                <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-1.5 ${statusMsg.ok ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border border-rose-500/20 text-rose-500"}`}>
                  {statusMsg.ok ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  {statusMsg.text}
                </div>
              )}
              <div className="relative">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  required
                  className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm text-foreground focus:outline-none"
                >
                  <option value="">Select new status…</option>
                  {validStatuses.map((s) => (
                    <option key={s} value={s}>{statusConfig[s]?.label || s}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              </div>
              <textarea
                value={statusDesc}
                onChange={(e) => setStatusDesc(e.target.value)}
                placeholder="Optional note…"
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm text-foreground focus:outline-none resize-none"
              />
              <button
                type="submit"
                disabled={statusSubmitting || !newStatus}
                className="w-full py-2.5 rounded-xl bg-foreground text-background font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-90 transition-all disabled:opacity-60"
              >
                {statusSubmitting ? <Loader2 size={13} className="animate-spin" /> : null}
                {statusSubmitting ? "Updating…" : "Push Status"}
              </button>
            </form>
          </div>

          {/* Assign Driver */}
          <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Assign Delivery Agent</h3>
            {assignedDriver && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1.5">
                <UserCheck size={12} /> Currently: {assignedDriver.fullName}
              </div>
            )}
            {driverMsg && (
              <div className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 ${driverMsg.ok ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border border-rose-500/20 text-rose-500"}`}>
                {driverMsg.ok ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                {driverMsg.text}
              </div>
            )}
            <div className="relative">
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm text-foreground focus:outline-none"
              >
                <option value="">Select driver…</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>{m.fullName}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
            <button
              onClick={handleAssignDriver}
              disabled={assigningDriver || !selectedDriver}
              className="w-full py-2.5 rounded-xl bg-foreground text-background font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-90 transition-all disabled:opacity-60"
            >
              {assigningDriver ? <Loader2 size={13} className="animate-spin" /> : <User size={13} />}
              {assigningDriver ? "Assigning…" : "Assign Agent"}
            </button>
          </div>

          {/* Assign Hub */}
          <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Route to Hub</h3>
            {assignedHub && (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-1.5">
                <Building2 size={12} /> Currently: {assignedHub.name}
              </div>
            )}
            {hubMsg && (
              <div className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-1.5 ${hubMsg.ok ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500" : "bg-rose-500/10 border border-rose-500/20 text-rose-500"}`}>
                {hubMsg.ok ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                {hubMsg.text}
              </div>
            )}
            {hubs.length === 0 ? (
              <p className="text-xs text-zinc-400">No hubs registered. <Link href="/dashboard/admin/hubs" className="underline">Add one →</Link></p>
            ) : (
              <>
                <div className="relative">
                  <select
                    value={selectedHub}
                    onChange={(e) => setSelectedHub(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm text-foreground focus:outline-none"
                  >
                    <option value="">Select hub…</option>
                    {hubs.map((h) => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                </div>
                <button
                  onClick={handleAssignHub}
                  disabled={assigningHub || !selectedHub}
                  className="w-full py-2.5 rounded-xl bg-foreground text-background font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-90 transition-all disabled:opacity-60"
                >
                  {assigningHub ? <Loader2 size={13} className="animate-spin" /> : <Building2 size={13} />}
                  {assigningHub ? "Routing…" : "Route to Hub"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
