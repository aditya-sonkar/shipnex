"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Warehouse,
  Truck,
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
  Loader2,
  X,
  Trash2,
} from "lucide-react";

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

// ─── Role Badge ───────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin:
      "bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border-violet-200/50 dark:border-violet-800/50",
    hub: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/50",
    delivery:
      "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/50",
  };
  const labels: Record<string, string> = {
    admin: "Admin",
    hub: "Hub Manager",
    delivery: "Delivery Partner",
  };
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
        styles[role] || styles.admin
      }`}
    >
      {labels[role] || role}
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────
export default function TeamPage() {
  const [showForm, setShowForm] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([]);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<"hub" | "delivery">("hub");
  const [showPw, setShowPw] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  // Fetch team
  useEffect(() => {
    fetch("http://localhost:5000/api/auth/users", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTeam(data);
      })
      .catch(() => {});
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formName || !formEmail || !formPassword) {
      setFormError("All fields are required.");
      return;
    }
    if (formPassword.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    setFormLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/register-member",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            fullName: formName,
            email: formEmail,
            password: formPassword,
            role: formRole,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register.");

      setFormSuccess(
        `${data.fullName} added as ${
          formRole === "hub" ? "Hub Manager" : "Delivery Partner"
        }`
      );
      setTeam((prev) => [
        { ...data, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setFormName("");
      setFormEmail("");
      setFormPassword("");
      setTimeout(() => {
        setFormSuccess("");
        setShowForm(false);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMember = async (member: TeamMember) => {
    if (!confirm(`Remove ${member.fullName} from the team? This cannot be undone.`)) return;
    setDeletingMemberId(member.id);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/users/${member.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setTeam((prev) => prev.filter((m) => m.id !== member.id));
      }
    } catch {}
    setDeletingMemberId(null);
  };

  const admins = team.filter((m) => m.role === "admin");
  const hubManagers = team.filter((m) => m.role === "hub");
  const deliveryPartners = team.filter((m) => m.role === "delivery");

  return (
    <>
      {/* Add Member Button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {team.length} members total
        </p>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormError("");
            setFormSuccess("");
          }}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          <UserPlus size={14} />
          <span className="hidden sm:inline">Add Member</span>
        </button>
      </div>

      {/* Add Member Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-foreground">
                  Register New Team Member
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  <X size={14} className="text-zinc-400" />
                </button>
              </div>

              <form onSubmit={handleAddMember} className="space-y-4">
                <AnimatePresence mode="wait">
                  {formError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/30 text-rose-500 text-xs font-medium"
                    >
                      {formError}
                    </motion.p>
                  )}
                  {formSuccess && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 text-emerald-500 text-xs font-medium flex items-center gap-2"
                    >
                      <CheckCircle2 size={13} />
                      {formSuccess}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Role Toggle */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Role
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormRole("hub")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        formRole === "hub"
                          ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300"
                          : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                      }`}
                    >
                      <Warehouse size={14} /> Hub Manager
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormRole("delivery")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        formRole === "delivery"
                          ? "bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300"
                          : "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                      }`}
                    >
                      <Truck size={14} /> Delivery Partner
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Name */}
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
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        disabled={formLoading}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 placeholder:text-zinc-400"
                      />
                    </div>
                  </div>
                  {/* Email */}
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
                        placeholder="jane@shipnex.com"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        disabled={formLoading}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 placeholder:text-zinc-400"
                      />
                    </div>
                  </div>
                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Temp Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={14} className="text-zinc-400" />
                      </span>
                      <input
                        type={showPw ? "text" : "password"}
                        placeholder="min 6 chars"
                        value={formPassword}
                        onChange={(e) => setFormPassword(e.target.value)}
                        disabled={formLoading}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 placeholder:text-zinc-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPw ? (
                          <EyeOff size={14} className="text-zinc-400" />
                        ) : (
                          <Eye size={14} className="text-zinc-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {formLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <UserPlus size={14} />
                    )}
                    {formLoading ? "Registering…" : "Register Member"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 text-center">
          <p className="text-3xl font-sans font-light text-foreground">
            {admins.length}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium uppercase tracking-wider">
            Admins
          </p>
        </div>
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 text-center">
          <p className="text-3xl font-sans font-light text-foreground">
            {hubManagers.length}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium uppercase tracking-wider">
            Hub Managers
          </p>
        </div>
        <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 text-center">
          <p className="text-3xl font-sans font-light text-foreground">
            {deliveryPartners.length}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium uppercase tracking-wider">
            Delivery Partners
          </p>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-zinc-100 dark:border-zinc-900">
          <h2 className="text-sm font-semibold text-foreground">All Members</h2>
        </div>

        {/* Desktop table header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-900">
          <div className="col-span-3">Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Joined</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {team.length === 0 ? (
          <div className="p-10 text-center">
            <Users
              size={24}
              className="text-zinc-300 dark:text-zinc-700 mx-auto mb-3"
            />
            <p className="text-sm text-zinc-500">No team members yet</p>
            <p className="text-xs text-zinc-400 mt-1">
              Click &quot;Add Member&quot; to get started
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {team.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 px-5 sm:px-6 py-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors items-center group"
              >
                <div className="sm:col-span-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-zinc-500">
                      {member.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">
                    {member.fullName}
                  </p>
                </div>
                <p className="sm:col-span-3 text-xs text-zinc-500 dark:text-zinc-400 truncate pl-11 sm:pl-0">
                  {member.email}
                </p>
                <div className="sm:col-span-2 pl-11 sm:pl-0">
                  <RoleBadge role={member.role} />
                </div>
                <p className="sm:col-span-2 text-xs text-zinc-400 pl-11 sm:pl-0 hidden sm:block">
                  {new Date(member.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <div className="sm:col-span-2 flex justify-end pl-11 sm:pl-0">
                  {member.role !== "admin" && (
                    <button
                      onClick={() => handleDeleteMember(member)}
                      disabled={deletingMemberId === member.id}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-zinc-400 hover:text-rose-500 transition-all disabled:opacity-60"
                      title={`Remove ${member.fullName}`}
                    >
                      {deletingMemberId === member.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
