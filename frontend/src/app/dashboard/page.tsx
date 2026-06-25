"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function DashboardIndexPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((user) => {
        if (user.role === "superadmin") {
          router.replace("/dashboard/superadmin");
        } else if (user.role === "admin") {
          router.replace("/dashboard/admin");
        } else if (user.role === "hub") {
          router.replace("/dashboard/hub");
        } else if (user.role === "delivery") {
          router.replace("/dashboard/delivery");
        } else {
          router.replace("/login");
        }
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
      <Loader2 className="w-8 h-8 animate-spin text-zinc-550 dark:text-zinc-400" />
      <p className="text-sm text-zinc-500 dark:text-zinc-450">
        Routing to your workspace layout…
      </p>
    </div>
  );
}
