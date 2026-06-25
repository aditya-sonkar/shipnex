"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";

const navItems = [
    { href: "/track", label: "Track" },
    { href: "/#features", label: "Features" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#faq", label: "FAQ" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);

        // Fetch current active user session
        fetch("/api/auth/me")
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Unauthorized");
            })
            .then((data) => {
                if (data && data.fullName) {
                    setUser(data);
                }
            })
            .catch(() => setUser(null));

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setUser(null);
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled
                    ? "bg-white dark:bg-zinc-950 border-zinc-200/20 dark:border-zinc-800/20 py-4"
                    : "bg-transparent border-transparent py-6"
                }`}
        >
            <div className="mx-auto flex w-full items-center justify-between px-8 lg:px-24">

                {/* Logo */}
                <Link href="/" className="text-3xl font-heading font-extrabold tracking-tight flex items-center select-none text-foreground">
                    shipnex
                </Link>

                {/* Navigation Links */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-xl font-heading font-bold text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors duration-250"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {user ? (
                        <>
                            <button
                                onClick={handleLogout}
                                className="hidden sm:inline-flex text-xl font-heading font-bold text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
                            >
                                Log Out
                            </button>

                            <Link
                                href="/dashboard"
                                className="hidden sm:inline-flex items-center justify-center rounded-full bg-foreground text-background px-8 py-4 text-sm font-bold leading-none shadow-sm hover:opacity-90 active:scale-98 transition-all"
                            >
                                Dashboard
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden sm:inline-flex text-xl font-heading font-bold text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white transition-colors"
                            >
                                Log In
                            </Link>

                            <Link
                                href="/signup"
                                className="hidden sm:inline-flex items-center justify-center rounded-full bg-foreground text-background px-8 py-4 text-sm font-bold leading-none shadow-sm hover:opacity-90 active:scale-98 transition-all"
                            >
                                Create Shipment
                            </Link>
                        </>
                    )}

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden flex flex-col items-center justify-center w-8 h-8 gap-1.5 cursor-pointer"
                        aria-label="Toggle menu"
                    >
                        <span
                            className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[4px]" : ""}`}
                        />
                        <span
                            className={`block w-6 h-0.5 bg-foreground transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[4px]" : ""}`}
                        />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`lg:hidden overflow-hidden transition-all duration-250 ease-in-out ${mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl px-6 py-4 space-y-4">
                    <nav className="flex flex-col gap-3">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className="py-2.5 text-xl font-heading font-bold text-zinc-800 dark:text-zinc-200 border-b border-zinc-150/40 dark:border-zinc-900 last:border-0"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {user ? (
                        <div className="flex items-center gap-4 pt-2">
                            <button
                                onClick={() => {
                                    setMobileOpen(false);
                                    handleLogout();
                                }}
                                className="flex-1 text-center rounded-full border border-zinc-200 dark:border-zinc-800 py-3 text-base font-heading font-bold text-zinc-800 dark:text-zinc-200 cursor-pointer"
                            >
                                Log Out
                            </button>
                            <Link
                                href="/dashboard"
                                onClick={() => setMobileOpen(false)}
                                className="flex-1 text-center rounded-full bg-foreground text-background py-3 text-sm font-bold"
                            >
                                Dashboard
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 pt-2">
                            <Link
                                href="/login"
                                onClick={() => setMobileOpen(false)}
                                className="flex-1 text-center rounded-full border border-zinc-200 dark:border-zinc-800 py-3 text-base font-heading font-bold text-zinc-800 dark:text-zinc-200"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setMobileOpen(false)}
                                className="flex-1 text-center rounded-full bg-foreground text-background py-3 text-sm font-bold"
                            >
                                Create Shipment
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}