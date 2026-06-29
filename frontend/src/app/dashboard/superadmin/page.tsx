"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Building2,
  PlusCircle,
  ToggleLeft,
  ToggleRight,
  Check,
  Loader2,
  Users,
  Package,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  subscriptionPlan: string;
  isActive: boolean;
  createdAt: string;
  _count?: { users: number; shipments: number };
}

const planStyles: Record<string, string> = {
  free: "bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200/50 dark:border-zinc-800/50",
  premium:
    "bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border-violet-200/50 dark:border-violet-800/50",
  enterprise:
    "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
};

export default function SuperAdminDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState("free");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [planChangingId, setPlanChangingId] = useState<string | null>(null);

  const fetchTenants = async () => {
    try {
      const res = await fetch("/api/auth/tenants");
      if (!res.ok) throw new Error("Failed to load tenants");
      const data = await res.json();
      setTenants(data);
    } catch {
      setError("Could not load tenants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !email || !password) return;

    setSubmitting(true);
    setError("");

    try {
      // Register as a new admin which creates a tenant automatically
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          fullName: companyName + " Admin",
          password,
          companyName,
          role: "admin",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setSubmitting(false);
        return;
      }

      // Update the plan if not free
      if (data.tenantId && plan !== "free") {
        await fetch(`/api/auth/tenants/${data.tenantId}/plan`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionPlan: plan }),
        });
      }

      setCompanyName("");
      setEmail("");
      setPassword("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchTenants();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (tenant: Tenant) => {
    setTogglingId(tenant.id);
    try {
      const res = await fetch(`/api/auth/tenants/${tenant.id}/toggle`, {
        method: "PATCH",
      });
      if (res.ok) {
        setTenants((prev) =>
          prev.map((t) => (t.id === tenant.id ? { ...t, isActive: !t.isActive } : t))
        );
      }
    } finally {
      setTogglingId(null);
    }
  };

  const handlePlanChange = async (tenantId: string, subscriptionPlan: string) => {
    setPlanChangingId(tenantId);
    try {
      const res = await fetch(`/api/auth/tenants/${tenantId}/plan`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionPlan }),
      });
      if (res.ok) {
        setTenants((prev) =>
          prev.map((t) => (t.id === tenantId ? { ...t, subscriptionPlan } : t))
        );
      }
    } finally {
      setPlanChangingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="border-b border-zinc-200/40 dark:border-zinc-800/40 pb-5">
        <h2 className="font-heading font-light text-3xl tracking-tight text-foreground">
          Platform Administration
        </h2>
        <p className="text-sm text-zinc-550 dark:text-zinc-400 mt-1.5 leading-relaxed">
          Manage system tenants, modify subscription tiers, and monitor overall instance health.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Tenants",
            value: tenants.length,
            icon: Building2,
            color: "text-violet-500",
          },
          {
            label: "Active Tenants",
            value: tenants.filter((t) => t.isActive).length,
            icon: Shield,
            color: "text-emerald-500",
          },
          {
            label: "Inactive",
            value: tenants.filter((t) => !t.isActive).length,
            icon: AlertCircle,
            color: "text-rose-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 flex items-center gap-4"
          >
            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-850">
              <stat.icon size={18} className={stat.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Register New Tenant */}
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 h-fit space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Register New Tenant</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Creates a new organisation & admin account</p>
          </div>

          <form onSubmit={handleAddTenant} className="space-y-3">
            {success && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium flex items-center gap-1.5">
                <Check size={14} /> Tenant registered successfully.
              </div>
            )}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium flex items-center gap-1.5">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            {[
              { label: "Company Name", value: companyName, setter: setCompanyName, placeholder: "e.g. Atlas Freight", type: "text" },
              { label: "Admin Email", value: email, setter: setEmail, placeholder: "admin@company.com", type: "email" },
              { label: "Admin Password", value: password, setter: setPassword, placeholder: "••••••••", type: "password" },
            ].map((field) => (
              <div key={field.label} className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  {field.label}
                </label>
                <input
                  suppressHydrationWarning
                  type={field.type}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>
            ))}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Subscription Tier
              </label>
              <select
                suppressHydrationWarning
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm text-foreground focus:outline-none"
              >
                <option value="free">Standard (Free)</option>
                <option value="premium">Premium Pack</option>
                <option value="enterprise">Enterprise VIP</option>
              </select>
            </div>

            <button
              suppressHydrationWarning
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-foreground text-background font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <PlusCircle size={14} />
              )}
              {submitting ? "Registering…" : "Register Tenant"}
            </button>
          </form>
        </div>

        {/* Tenant Registry */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Registered Tenants ({tenants.length})
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Control access credentials and billing status
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-zinc-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading tenants…</span>
            </div>
          ) : tenants.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 text-sm">
              No tenants registered yet.
            </div>
          ) : (
            <div className="divide-y divide-zinc-200/30 dark:divide-zinc-800/40">
              {tenants.map((tenant) => (
                <div key={tenant.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-850 shrink-0">
                      <Building2 size={15} className="text-zinc-550" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{tenant.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                            planStyles[tenant.subscriptionPlan] || planStyles.free
                          }`}
                        >
                          {tenant.subscriptionPlan}
                        </span>
                        {tenant._count && (
                          <>
                            <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                              <Users size={9} /> {tenant._count.users}
                            </span>
                            <span className="text-[10px] text-zinc-400 flex items-center gap-0.5">
                              <Package size={9} /> {tenant._count.shipments}
                            </span>
                          </>
                        )}
                        <span className="text-[10px] text-zinc-400">
                          {new Date(tenant.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Plan changer */}
                    <div className="relative">
                      <select
                        suppressHydrationWarning
                        value={tenant.subscriptionPlan}
                        onChange={(e) => handlePlanChange(tenant.id, e.target.value)}
                        disabled={planChangingId === tenant.id}
                        className="appearance-none text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 pr-6 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-foreground focus:outline-none cursor-pointer disabled:opacity-60"
                      >
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                      <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>

                    {/* Toggle */}
                    <button
                      suppressHydrationWarning
                      onClick={() => handleToggle(tenant)}
                      disabled={togglingId === tenant.id}
                      className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors disabled:opacity-60"
                    >
                      {togglingId === tenant.id ? (
                        <Loader2 size={18} className="animate-spin text-zinc-400" />
                      ) : tenant.isActive ? (
                        <span className="flex items-center gap-1.5 text-emerald-500 font-semibold text-xs">
                          Active <ToggleRight size={22} className="text-emerald-500" />
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-zinc-400 font-semibold text-xs">
                          Disabled <ToggleLeft size={22} className="text-zinc-400" />
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
