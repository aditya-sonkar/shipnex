"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  XCircle,
  Warehouse,
  ArrowUpDown,
  Eye,
} from "lucide-react";

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
  updatedAt: string;
}

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ComponentType<any> }
> = {
  pending: {
    label: "Pending",
    color:
      "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200/50 dark:border-zinc-800/50",
    icon: Clock,
  },
  picked_up: {
    label: "Picked Up",
    color:
      "bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border-violet-200/50 dark:border-violet-800/50",
    icon: Package,
  },
  in_transit: {
    label: "In Transit",
    color:
      "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50",
    icon: Truck,
  },
  at_hub: {
    label: "At Hub",
    color:
      "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
    icon: Warehouse,
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color:
      "bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border-sky-200/50 dark:border-sky-800/50",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color:
      "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/50",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color:
      "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/50",
    icon: XCircle,
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${config.color}`}
    >
      <Icon size={10} />
      {config.label}
    </span>
  );
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [deliveryAgents, setDeliveryAgents] = useState<{id: string, fullName: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [assigningAgent, setAssigningAgent] = useState(false);

  const fetchShipments = (status = "all") => {
    setLoading(true);
    let url = "/api/shipments";
    if (status !== "all") url += `?status=${status}`;

    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setShipments(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchAgents = () => {
    fetch("/api/auth/users", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDeliveryAgents(data.filter((u: any) => u.role === "delivery"));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchShipments("all");
    fetchAgents();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/shipments/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setShipments(shipments.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
        if (selectedShipment?.id === id) {
          setSelectedShipment({ ...selectedShipment, status: newStatus });
        }
      }
    } catch {}
    setUpdatingStatus(false);
  };

  const handleAssignAgent = async (shipmentId: string, agentId: string) => {
    if (!agentId) return;
    setAssigningAgent(true);
    try {
      const res = await fetch(`/api/shipments/${shipmentId}/assign-agent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ assignedDriverId: agentId }),
      });
      if (res.ok) {
        setShipments(shipments.map(s => s.id === shipmentId ? { ...s, assignedDriverId: agentId } : s));
        if (selectedShipment?.id === shipmentId) {
          setSelectedShipment({ ...selectedShipment, assignedDriverId: agentId } as any);
        }
      }
    } catch {}
    setAssigningAgent(false);
  };

  const filtered = shipments.filter((s) => {
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    if (!matchesStatus) return false;
    
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.trackingNumber.toLowerCase().includes(q) ||
      s.senderName.toLowerCase().includes(q) ||
      s.receiverName.toLowerCase().includes(q)
    );
  });

  const statuses = [
    "all",
    "pending",
    "picked_up",
    "in_transit",
    "at_hub",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];

  const statusCounts = statuses.reduce((acc, s) => {
    acc[s] =
      s === "all"
        ? shipments.length
        : shipments.filter((sh) => sh.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-sans font-light text-foreground">
            {shipments.length}
          </p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider mt-1">
            Total
          </p>
        </div>
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-sans font-light text-emerald-600 dark:text-emerald-400">
            {shipments.filter((s) => s.status === "delivered").length}
          </p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider mt-1">
            Delivered
          </p>
        </div>
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-sans font-light text-blue-600 dark:text-blue-400">
            {shipments.filter((s) => s.status === "in_transit").length}
          </p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider mt-1">
            In Transit
          </p>
        </div>
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-sans font-light text-amber-600 dark:text-amber-400">
            {shipments.filter((s) => s.status === "pending").length}
          </p>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium uppercase tracking-wider mt-1">
            Pending
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                statusFilter === s
                  ? "bg-foreground text-background border-foreground"
                  : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-foreground"
              }`}
            >
              {s === "all"
                ? "All"
                : statusConfig[s]?.label || s}
              {statusCounts[s] > 0 && (
                <span className="ml-1.5 opacity-60">
                  {statusCounts[s]}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            placeholder="Search by tracking #, sender, receiver…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 placeholder:text-zinc-400"
          />
        </div>
      </div>

      {/* Shipment Detail Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedShipment(null)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-heading font-light text-foreground">
                  {selectedShipment.trackingNumber}
                </h3>
                <StatusBadge status={selectedShipment.status} />
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/admin/shipments/${selectedShipment.id}/label`}
                  target="_blank"
                  className="px-3 py-1.5 bg-foreground text-background text-xs font-semibold rounded-lg hover:opacity-90"
                >
                  Print Label
                </Link>
                <button
                  onClick={() => setSelectedShipment(null)}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <XCircle size={16} className="text-zinc-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Sender
                </p>
                <p className="text-sm font-medium text-foreground">
                  {selectedShipment.senderName}
                </p>
                <p className="text-xs text-zinc-500">
                  {selectedShipment.senderAddress}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Receiver
                </p>
                <p className="text-sm font-medium text-foreground">
                  {selectedShipment.receiverName}
                </p>
                <p className="text-xs text-zinc-500">
                  {selectedShipment.receiverAddress}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Weight
                </p>
                <p className="text-sm font-medium text-foreground">
                  {selectedShipment.weight} kg
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Created
                </p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(selectedShipment.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Update Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "pending",
                    "picked_up",
                    "in_transit",
                    "at_hub",
                    "out_for_delivery",
                    "delivered",
                    "cancelled",
                  ].map((s) => (
                    <button
                      key={s}
                      disabled={
                        updatingStatus || selectedShipment.status === s
                      }
                      onClick={() =>
                        handleStatusUpdate(selectedShipment.id, s)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedShipment.status === s
                          ? "bg-foreground text-background border-foreground"
                          : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:text-foreground disabled:opacity-50"
                      }`}
                    >
                      {statusConfig[s]?.label || s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assign Delivery Partner */}
              <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Assign Delivery Partner
                </p>
                <div className="flex gap-2">
                  <select
                    className="flex-1 px-3 py-2 rounded-lg text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700"
                    onChange={(e) => handleAssignAgent(selectedShipment.id, e.target.value)}
                    value={(selectedShipment as any).assignedDriverId || ""}
                    disabled={assigningAgent}
                  >
                    <option value="" disabled>Select a driver...</option>
                    {deliveryAgents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.fullName}
                      </option>
                    ))}
                  </select>
                  {assigningAgent && (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                      <div className="w-4 h-4 rounded-full border-2 border-zinc-200 border-t-zinc-600 animate-spin" />
                    </div>
                  )}
                </div>
                {(selectedShipment as any).assignedDriverId && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    ✓ Assigned successfully
                  </p>
                )}
              </div>
            </div>
        </div>
      )}

      {/* Shipments Table */}
      <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            {filtered.length} shipment{filtered.length !== 1 ? "s" : ""}
          </h2>
          <Link
            href="/dashboard/admin/create"
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-foreground transition-colors font-medium"
          >
            + New Shipment
          </Link>
        </div>

        {/* Desktop table header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-900">
          <div className="col-span-2">Tracking #</div>
          <div className="col-span-2">Sender</div>
          <div className="col-span-2">Receiver</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Weight</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1"></div>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <div className="w-6 h-6 rounded-full border-2 border-zinc-200 dark:border-zinc-800 border-t-zinc-600 dark:border-t-zinc-400 animate-spin mx-auto mb-3" />
            <p className="text-xs text-zinc-500">Loading shipments…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Package
              size={24}
              className="text-zinc-300 dark:text-zinc-700 mx-auto mb-3"
            />
            <p className="text-sm text-zinc-500">No shipments found</p>
            <p className="text-xs text-zinc-400 mt-1">
              {searchQuery
                ? "Try a different search term"
                : "Create your first shipment to get started"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {filtered.map((shipment) => (
              <div
                key={shipment.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-1 lg:gap-4 px-5 sm:px-6 py-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors items-center cursor-pointer"
                onClick={() => setSelectedShipment(shipment)}
              >
                <div className="lg:col-span-2">
                  <p className="text-sm font-semibold text-foreground font-mono">
                    {shipment.trackingNumber}
                  </p>
                </div>
                <div className="lg:col-span-2 hidden lg:block">
                  <p className="text-sm text-foreground truncate">
                    {shipment.senderName}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {shipment.senderAddress}
                  </p>
                </div>
                <div className="lg:col-span-2 hidden lg:block">
                  <p className="text-sm text-foreground truncate">
                    {shipment.receiverName}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {shipment.receiverAddress}
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <StatusBadge status={shipment.status} />
                </div>
                <div className="lg:col-span-1 hidden lg:block">
                  <p className="text-xs text-zinc-500">{shipment.weight} kg</p>
                </div>
                <div className="lg:col-span-2 hidden lg:block">
                  <p className="text-xs text-zinc-400">
                    {new Date(shipment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="lg:col-span-1 hidden lg:flex justify-end">
                  <Eye
                    size={14}
                    className="text-zinc-300 dark:text-zinc-700"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
