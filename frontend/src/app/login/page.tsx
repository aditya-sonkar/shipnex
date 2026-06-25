"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Truck, Warehouse, Shield } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

// ─── ROLES DETAILS ───
// These match the visual tokens (e.g. tag pill style) seen in Features.tsx
const ROLES = [
  {
    id: "delivery",
    title: "Delivery Partner",
    description: "Fleet routing & parcel status updates",
    icon: Truck,
    placeholder: "courier.id@shipnex.com",
    tags: ["FLEET", "DISPATCH", "COURIER"],
    onSuccessRedirect: "/dashboard/delivery",
  },
  {
    id: "hub",
    title: "Hub Manager",
    description: "Inventory sorting & local route dispatch",
    icon: Warehouse,
    placeholder: "manager.chicago@shipnex.com",
    tags: ["SORTING", "INVENTORY", "LOGISTICS"],
    onSuccessRedirect: "/dashboard/hub",
  },
  {
    id: "admin",
    title: "Company Admin",
    description: "Global settings, integrations & metrics",
    icon: Shield,
    placeholder: "admin.billing@shipnex.com",
    tags: ["GLOBAL", "ANALYTICS", "SECURITY"],
    onSuccessRedirect: "/dashboard/admin",
  },
];

interface LoginFormCardProps {
  roleId: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  placeholder: string;
  tags: string[];
  onSuccessRedirect: string;
}

function LoginFormCard({
  roleId,
  title,
  description,
  icon: IconComponent,
  placeholder,
  tags,
  onSuccessRedirect,
}: LoginFormCardProps) {
  const router = useRouter();

  // Independent local state controls
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, role: roleId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials.");
      }

      setSuccess(true);
      setTimeout(() => {
        if (data.role === "superadmin") {
          router.push("/dashboard/superadmin");
        } else {
          router.push(onSuccessRedirect);
        }
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/40 dark:border-zinc-800/40 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6 transition-all duration-300 hover:shadow-md hover:border-zinc-350 dark:hover:border-zinc-700">

      {/* Header and Icon - Uses neutral colors to match brand aesthetics */}
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-zinc-800 dark:text-zinc-200">
              <IconComponent size={20} />
            </span>
            <h2 className="font-heading font-light text-2xl tracking-tight text-foreground">{title}</h2>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight pr-4">{description}</p>
        </div>
      </div>

      {/* Badges list matching features.tsx tags */}
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-550 dark:text-zinc-400 text-[8px] font-bold tracking-widest uppercase"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-900" />

      {/* Form area */}
      <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3.5 rounded-xl bg-rose-550/5 border border-rose-500/10 text-rose-500 text-xs font-medium"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-emerald-550/5 border border-emerald-500/10 text-emerald-500 text-xs font-medium"
              >
                Verification successful. Welcome!
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" htmlFor={`${roleId}-email`}>
              Work Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                <Mail size={15} />
              </span>
              <input
                id={`${roleId}-email`}
                type="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 focus:border-zinc-300 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" htmlFor={`${roleId}-password`}>
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                <Lock size={15} />
              </span>
              <input
                id={`${roleId}-password`}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || success}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 focus:border-zinc-300 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || success}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        {/* Action Button - Styled as a rounded-full brand action button */}
        <button
          type="submit"
          disabled={loading || success}
          className="w-full flex items-center justify-center rounded-full bg-foreground text-background py-3.5 text-xs font-bold tracking-widest uppercase shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 mt-6"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <span className="flex items-center gap-1.5">
              Sign In <ArrowRight size={14} />
            </span>
          )}
        </button>
      </form>

      {/* Footer Back link to Signup page */}
      <div className="text-center pt-2 border-t border-zinc-100 dark:border-zinc-900/50 mt-4">
        <p className="text-xs text-zinc-550 dark:text-zinc-500">
          New user?{" "}
          <Link
            href="/signup"
            className="font-semibold text-foreground underline decoration-zinc-400 hover:decoration-foreground transition-all"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <main className="min-h-screen w-full flex flex-col justify-between p-6 relative overflow-hidden bg-background text-foreground select-none">

      {/* Spotlights and Ambient Mesh Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_-200px,rgba(42,103,156,0.06),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_700px_at_-100px_300px,rgba(0,229,163,0.03),transparent)] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 py-4">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-foreground select-none">
          shipnex
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/signup"
            className="text-[13px] font-semibold border border-zinc-200 dark:border-zinc-800 rounded-full px-5 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Portal Container */}
      <div className="w-full flex-grow flex flex-col justify-center max-w-7xl mx-auto py-8 lg:py-16 z-10 space-y-12">

        {/* Title Segment - Leverages cormorant font-heading */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="font-heading font-light text-[42px] lg:text-[56px] leading-[1.1] tracking-[-0.02em] text-foreground">
            Portal Access
          </h1>
          <p className="text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed font-normal text-pretty max-w-md mx-auto">
            Log in to your respective workspace panel to access shipment metrics, local sorting systems, or fleet routing tools.
          </p>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full">
          {ROLES.map((role) => (
            <LoginFormCard
              key={role.id}
              roleId={role.id}
              title={role.title}
              description={role.description}
              icon={role.icon}
              placeholder={role.placeholder}
              tags={role.tags}
              onSuccessRedirect={role.onSuccessRedirect}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-[11px] text-zinc-550 z-10 py-4 border-t border-zinc-200/10">
        © {new Date().getFullYear()} ShipNex Inc. All rights reserved.
      </footer>
    </main>
  );
}