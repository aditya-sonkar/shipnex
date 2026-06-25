"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Truck,
  Warehouse,
  Users,
  Settings,
  LogOut,
  TrendingUp,
  Building2,
  Menu,
  X,
  ScanLine,
  Boxes,
  Route,
  CheckCircle2,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

interface User {
  id: string;
  fullName: string;
  companyName?: string | null;
  email: string;
  role: "superadmin" | "admin" | "hub" | "delivery";
}

interface SidebarLinkProps {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  active?: boolean;
}

function SidebarLink({ icon: Icon, label, href, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${active
          ? "bg-zinc-100 dark:bg-zinc-900 text-foreground"
          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:text-foreground"
        }`}
    >
      <Icon
        size={15}
        className={
          active
            ? "text-foreground"
            : "text-zinc-400 dark:text-zinc-500 group-hover:text-foreground"
        }
      />
      {label}
    </Link>
  );
}

function SidebarContent({
  user,
  pathname,
  onLogout,
  onClose,
}: {
  user: User | null;
  pathname: string;
  onLogout: () => void;
  onClose?: () => void;
}) {
  const isActive = (href: string) => pathname === href;

  // Role-based links mapping
  const getLinks = () => {
    if (!user) return [];
    switch (user.role) {
      case "superadmin":
        return [
          { icon: Building2, label: "Tenants Registry", href: "/dashboard/superadmin" },
        ];
      case "admin":
        return [
          { icon: Package, label: "Shipments", href: "/dashboard/admin/shipments" },
          { icon: Users, label: "Team Management", href: "/dashboard/admin/team" },
          { icon: TrendingUp, label: "Analytics", href: "/dashboard/admin" },
        ];
      case "hub":
        return [
          { icon: ScanLine, label: "Scan Packages", href: "/dashboard/hub/scan" },
          { icon: Boxes, label: "Hub Inventory", href: "/dashboard/hub" },
        ];
      case "delivery":
        return [
          { icon: Route, label: "My Route", href: "/dashboard/delivery" },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();
  const roleLabel =
    user?.role === "superadmin"
      ? "Super Admin"
      : user?.role === "admin"
        ? "Company Admin"
        : user?.role === "hub"
          ? "Hub Manager"
          : "Delivery Agent";

  return (
    <div className="flex flex-col h-full px-4 py-6">
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          onClick={onClose}
          className="px-3 font-heading font-light text-2xl tracking-tight text-foreground select-none"
        >
          shipnex
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors lg:hidden"
          >
            <X size={16} className="text-zinc-500" />
          </button>
        )}
      </div>

      {user && (
        <div className="flex items-center gap-2.5 px-3 py-2.5 mb-6 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50">
          <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0">
            <Building2 size={13} className="text-zinc-600 dark:text-zinc-400" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {user.companyName}
            </p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {roleLabel}
            </p>
          </div>
        </div>
      )}

      <nav className="flex flex-col gap-1 flex-1">
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest px-3 mb-2">
          Workspace Links
        </p>
        {links.map((link) => (
          <SidebarLink
            key={link.label}
            icon={link.icon}
            label={link.label}
            href={link.href}
            active={isActive(link.href)}
          />
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 transition-all duration-200 mt-4"
      >
        <LogOut size={15} />
        Log Out
      </button>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch active session from proxy route
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  // Close sidebar on resize or navigation
  useEffect(() => {
    const close = () => setSidebarOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-zinc-200 dark:border-zinc-800 border-t-zinc-650 dark:border-t-zinc-450 animate-spin" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Resolving workspace layout…
          </p>
        </div>
      </div>
    );
  }

  // Generate dynamic page title based on current routing path
  const getPageTitle = () => {
    const segments = pathname.split("/");
    const last = segments[segments.length - 1];

    const titles: Record<string, string> = {
      superadmin: "Platform Administration",
      admin: "Company Operations",
      hub: "Sorting Facility",
      delivery: "Delivery Operations",
      shipments: "Shipments",
      team: "Team Management",
      scan: "Scan Packages",
    };

    return titles[last] || "Dashboard";
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200/60 dark:border-zinc-800/60 z-50 overflow-y-auto">
            <SidebarContent
              user={user}
              pathname={pathname}
              onLogout={handleLogout}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl sticky top-0 h-screen overflow-y-auto">
        <SidebarContent
          user={user}
          pathname={pathname}
          onLogout={handleLogout}
        />
      </aside>

      {/* Workspace Panel */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors lg:hidden shrink-0"
            >
              <Menu size={16} className="text-zinc-650 dark:text-zinc-400" />
            </button>
            <div className="min-w-0">
              <h1 className="font-heading font-light text-xl sm:text-2xl tracking-tight text-foreground">
                {getPageTitle()}
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate hidden sm:block">
                Active Session:{" "}
                <span className="font-semibold text-foreground">
                  {user?.fullName}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
