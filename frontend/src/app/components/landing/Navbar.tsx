"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import ThemeToggle from "../ThemeToggle";

const navItems = [
    { href: "/#solutions", label: "Solutions" },
    { href: "/#journey", label: "Journey" },
    { href: "/#features", label: "Features" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);

    // Scroll state: hide while actively scrolling, show centered capsule on scroll stop
    const [isScrolling, setIsScrolling] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLight, setIsLight] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
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
    }, []);

    // Scroll listener:
    // 1. In Hero (scrollY <= 80): ALWAYS visible, never hides
    // 2. Scrolled out of Hero: hides while actively scrolling
    // 3. Scroll stops anywhere: smoothly animates down from top
    // 4. Dynamically detects underlying section color (light vs dark) for adaptive contrast
    useEffect(() => {
        const checkLight = () => {
            if (typeof window === "undefined") return false;
            const elements = document.elementsFromPoint(window.innerWidth / 2, 42);
            for (const el of elements) {
                if (el.closest("header") || el.tagName === "HEADER" || el.tagName === "NAV") continue;
                let curr: HTMLElement | null = el as HTMLElement;
                while (curr && curr !== document.body && curr !== document.documentElement) {
                    const bg = window.getComputedStyle(curr).backgroundColor;
                    if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
                        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                        if (match) {
                            const r = parseInt(match[1]);
                            const g = parseInt(match[2]);
                            const b = parseInt(match[3]);
                            const a = match[4] !== undefined ? parseFloat(match[4]) : 1;
                            if (a > 0.25) {
                                const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                                return brightness > 165;
                            }
                        }
                    }
                    curr = curr.parentElement;
                }
            }
            return false;
        };

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const heroThreshold = 80;

            setIsLight(checkLight());

            if (currentScrollY <= heroThreshold) {
                // Inside Hero: always visible, no scroll-hiding
                setIsScrolled(false);
                setIsScrolling(false);
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
            } else {
                // Once scrolled past Hero:
                setIsScrolled(true);

                // Hide while actively scrolling
                setIsScrolling(true);

                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }

                // Smoothly reveal navbar from top when scrolling stops (harmonized with Lenis inertia)
                scrollTimeoutRef.current = setTimeout(() => {
                    setIsScrolling(false);
                    setIsLight(checkLight());
                }, 280);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
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

    const handleLogoClick = (e: React.MouseEvent) => {
        if (window.location.pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.history.pushState("", document.title, window.location.pathname);
        }
    };

    const handleNavItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("/#") && window.location.pathname === "/") {
            e.preventDefault();
            const id = href.replace("/#", "");
            const element = document.getElementById(id);
            if (element) {
                const headerOffset = 90;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                window.history.pushState(null, "", href);
                setMobileOpen(false);
            } else {
                if (id === "contact") {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                }
                setMobileOpen(false);
            }
        } else {
            setMobileOpen(false);
        }
    };

    return (
        <header
            style={{
                transform: isScrolling ? "translateY(-32px)" : "translateY(0)",
                opacity: isScrolling ? 0 : 1,
                transition: isScrolling
                    ? "transform 250ms ease-in, opacity 200ms ease-in"
                    : "transform 650ms cubic-bezier(0.16, 1, 0.3, 1), opacity 550ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="fixed top-0 left-0 right-0 z-50 pointer-events-none py-3 sm:py-4"
        >
            <div className="relative mx-auto flex w-full h-12 sm:h-14 items-center justify-between px-4 sm:px-6 md:px-10 lg:px-14">
                {/* Left Section: Logo (Vertically centered) */}
                <div className={`flex items-center gap-3 sm:gap-6 pointer-events-auto shrink-0 transition-opacity duration-300 ${isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                    <a
                        href="/"
                        onClick={handleLogoClick}
                        aria-label="Shipnex Home"
                        className="text-2xl font-extrabold tracking-tighter text-white select-none cursor-pointer transition-opacity hover:opacity-90 flex items-center"
                    >
                        shipnex
                    </a>
                </div>

                {/* Center Section: Dead-centered vertically & horizontally on the EXACT SAME LEVEL */}
                <nav
                    className={`hidden xl:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 gap-5 2xl:gap-7 text-sm items-center backdrop-blur-xl border rounded-2xl px-6 2xl:px-8 h-12 transition-all duration-300 pointer-events-auto ${isLight
                        ? "bg-white/80 border-black/10 text-[#132438] shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
                        : "bg-white/10 border-white/20 text-white shadow-[0_4px_24px_rgba(0,0,0,0.18)]"
                        }`}
                >
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            data-text={item.label}
                            onClick={(e) => handleNavItemClick(e, item.href)}
                            className={`nav-link-stable whitespace-nowrap transition-all font-outfit hover:font-bold cursor-pointer ${isLight
                                ? "text-[#132438] hover:text-black"
                                : "text-white/90 hover:text-white"
                                }`}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Right Section: Auth & Mobile Menu */}
                <div className="flex items-center gap-2 sm:gap-4 pointer-events-auto shrink-0">
                    {/* Desktop ThemeToggle and Auth buttons (fade out when scrolled) */}
                    <div className={`hidden xl:flex items-center gap-3 sm:gap-4 transition-opacity duration-300 ${isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                        <ThemeToggle />
                        {user ? (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link
                                    href="/dashboard"
                                    className="hidden md:inline-flex relative group overflow-hidden rounded-xl border border-white/35 hover:border-white/60 bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-white tracking-wide transition-all duration-200 shadow-sm select-none items-center justify-center cursor-pointer"
                                >
                                    <span>Dashboard</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="hidden sm:inline-flex text-xs font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link
                                    href="/signup"
                                    className="hidden md:inline-flex text-xs font-medium text-white/80 hover:text-white transition-colors"
                                >
                                    Sign Up
                                </Link>

                                <Link
                                    href="/login"
                                    className="hidden md:inline-flex relative group overflow-hidden rounded-xl border border-white/35 hover:border-white/60 bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-sm px-3.5 sm:px-6 py-1.5 sm:py-2.5 text-xs sm:text-sm font-medium text-white tracking-wide transition-all duration-200 shadow-sm select-none items-center justify-center cursor-pointer"
                                >
                                    <span>Log In</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Minimal Borderless Hamburger Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className={`xl:hidden flex flex-col items-center justify-center w-11 h-11 cursor-pointer bg-transparent border-0 text-white transition-transform active:scale-90 shrink-0 p-1 select-none ${isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                        aria-label="Toggle menu"
                        aria-expanded={mobileOpen}
                    >
                        <div className="flex flex-col items-center justify-center gap-2 w-6">
                            <span
                                className={`block w-6 h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[5px]" : ""}`}
                            />
                            <span
                                className={`block w-6 h-[2px] bg-white rounded-full transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""}`}
                            />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Drawer (Only at top of page) */}
            {!isScrolled && (
                <div
                    className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out pointer-events-auto ${mobileOpen ? "max-h-[580px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="border-t border-white/10 bg-zinc-950/95 backdrop-blur-2xl px-6 py-6 space-y-5 text-white">
                        {/* Mobile navigation links */}
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => handleNavItemClick(e, item.href)}
                                    className="py-2.5 text-sm font-medium text-white/90 hover:text-white border-b border-white/5 last:border-0 cursor-pointer flex items-center justify-between"
                                >
                                    <span>{item.label}</span>
                                    <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-white/40" />
                                </a>
                            ))}
                        </nav>

                        {/* Mobile Action Buttons */}
                        <div className="pt-2 flex flex-col gap-3">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex-1 text-center rounded-xl bg-white text-zinc-950 py-2.5 text-xs font-bold"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setMobileOpen(false);
                                            handleLogout();
                                        }}
                                        className="flex-1 text-center rounded-xl border border-white/20 py-2.5 text-xs font-medium text-white"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex-1 text-center rounded-xl border border-white/35 bg-white/10 py-2.5 text-xs font-medium text-white"
                                    >
                                        <span>Log In</span>
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex-1 text-center rounded-xl bg-white text-zinc-950 py-2.5 text-xs font-bold hover:bg-zinc-100"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}

                            <div className="pt-2 flex items-center justify-between border-t border-white/10">
                                <span className="text-xs text-zinc-400">Appearance Theme</span>
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
