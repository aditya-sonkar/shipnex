"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  User,
  MapPin,
  Weight,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Send,
  Mail,
} from "lucide-react";

export default function CreateShipmentPage() {
  const router = useRouter();
  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdTracking, setCreatedTracking] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !senderName ||
      !senderAddress ||
      !receiverName ||
      !receiverEmail ||
      !receiverAddress ||
      !weight
    ) {
      setError("All fields are required.");
      return;
    }
    if (isNaN(Number(weight)) || Number(weight) <= 0) {
      setError("Weight must be a positive number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          senderName,
          senderAddress,
          receiverName,
          receiverEmail,
          receiverAddress,
          weight,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to create shipment.");

      setCreatedTracking(data.trackingNumber);
      setSuccess(`Shipment ${data.trackingNumber} created successfully!`);
      setSenderName("");
      setSenderAddress("");
      setReceiverName("");
      setReceiverEmail("");
      setReceiverAddress("");
      setWeight("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Success State */}
      {success && (
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 rounded-2xl p-6 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center">
            <CheckCircle2 size={20} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{success}</p>
            <p className="text-xs text-zinc-500 mt-1">
              Tracking Number:{" "}
              <span className="font-mono font-bold text-foreground">
                {createdTracking}
              </span>
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setSuccess("");
                setCreatedTracking("");
              }}
              className="px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Create Another
            </button>
            <button
              onClick={() => router.push("/dashboard/admin/shipments")}
              className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              View All Shipments
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      {!success && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/30 text-rose-500 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sender Card */}
            <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-800/50">
                  <Send
                    size={13}
                    className="text-blue-500"
                  />
                </div>
                <h2 className="text-sm font-semibold text-foreground">
                  Sender Details
                </h2>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={14} className="text-zinc-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Address
                </label>
                <div className="relative">
                  <span className="absolute top-3 left-0 pl-3 pointer-events-none">
                    <MapPin size={14} className="text-zinc-400" />
                  </span>
                  <textarea
                    placeholder="123 Main Street, City, State, ZIP"
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
                    disabled={loading}
                    rows={3}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 placeholder:text-zinc-400 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Receiver Card */}
            <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/50 dark:border-emerald-800/50">
                  <Package
                    size={13}
                    className="text-emerald-500"
                  />
                </div>
                <h2 className="text-sm font-semibold text-foreground">
                  Receiver Details
                </h2>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={14} className="text-zinc-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={14} className="text-zinc-400" />
                  </span>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    value={receiverEmail}
                    onChange={(e) => setReceiverEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Address
                </label>
                <div className="relative">
                  <span className="absolute top-3 left-0 pl-3 pointer-events-none">
                    <MapPin size={14} className="text-zinc-400" />
                  </span>
                  <textarea
                    placeholder="456 Oak Avenue, City, State, ZIP"
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    disabled={loading}
                    rows={3}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 placeholder:text-zinc-400 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Weight + Submit */}
          <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="space-y-1.5 flex-1 max-w-xs">
                <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Package Weight (kg)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Weight size={14} className="text-zinc-400" />
                  </span>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="0.0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    disabled={loading}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 placeholder:text-zinc-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Package size={16} />
                )}
                {loading ? "Creating…" : "Create Shipment"}
                {!loading && <ArrowRight size={14} />}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
