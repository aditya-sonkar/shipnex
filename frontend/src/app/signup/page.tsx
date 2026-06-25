"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, User, Building } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

export default function Signup() {
  const router = useRouter();

  // Core registration states
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!companyName || !fullName || !email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col justify-between p-6 relative overflow-hidden bg-background text-foreground select-none">

      {/* Background Mesh Glow decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_-200px,rgba(42,103,156,0.06),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_700px_at_-100px_300px,rgba(0,229,163,0.03),transparent)] pointer-events-none" />

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 py-4">
        <Link href="/" className="text-2xl font-heading font-light tracking-tight text-foreground select-none">
          shipnex
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-[13px] font-semibold border border-zinc-200 dark:border-zinc-800 rounded-full px-5 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Log In
          </Link>
        </div>
      </header>

      {/* Center Signup Card */}
      <div className="w-full flex-grow flex items-center justify-center py-8 z-10">
        <div className="w-full max-w-[480px] bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">

          <div className="space-y-2 text-center">
            <h1 className="font-heading font-light text-3xl tracking-tight text-foreground">Admin Registration</h1>
            <p className="text-sm text-zinc-550 dark:text-zinc-400">
              Register your organization on the ShipNex platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  Organization created! Redirecting to login portal...
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {/* Company Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" htmlFor="company">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                    <Building size={15} />
                  </span>
                  <input
                    id="company"
                    type="text"
                    placeholder="Acme Logistics Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={loading || success}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 focus:border-zinc-300 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" htmlFor="fullname">
                  Admin Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                    <User size={15} />
                  </span>
                  <input
                    id="fullname"
                    type="text"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading || success}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 focus:border-zinc-300 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" htmlFor="email">
                  Admin Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                    <Mail size={15} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="admin.name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || success}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 focus:border-zinc-300 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                    <Lock size={15} />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading || success}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 focus:border-zinc-300 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" htmlFor="confirmpassword">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                    <Lock size={15} />
                  </span>
                  <input
                    id="confirmpassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading || success}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 focus:border-zinc-300 dark:focus:border-zinc-700 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center rounded-full bg-foreground text-background py-3.5 text-xs font-bold tracking-widest uppercase shadow-sm hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 mt-6"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <span className="flex items-center gap-1.5">
                  Register Organization <ArrowRight size={14} />
                </span>
              )}
            </button>
          </form>

          {/* Role Alert Notice Card */}
          <div className="p-3 bg-zinc-550/5 dark:bg-zinc-900/55 border border-zinc-250/20 dark:border-zinc-800/30 rounded-xl text-center">
            <p className="text-[10px] text-zinc-500 leading-normal">
              Are you a <strong>Delivery Partner</strong> or <strong>Hub Manager</strong>? Please request credentials from your company administrator to gain access. Only Admins can register publicly.
            </p>
          </div>

          {/* Footer Back link */}
          <div className="text-center pt-2">
            <p className="text-xs text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-foreground underline decoration-zinc-400 hover:decoration-foreground transition-all">
                Log In
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-[11px] text-zinc-550 z-10 py-4 border-t border-zinc-200/10">
        © {new Date().getFullYear()} ShipNex Inc. All rights reserved.
      </footer>
    </main>
  );
}
