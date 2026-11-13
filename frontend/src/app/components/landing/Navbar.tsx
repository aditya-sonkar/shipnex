"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const navItems = [
    { href: "/#about", label: "About" },
    { href: "/#features", label: "Features" },
    { href: "/#services", label: "Services" },
    { href: "/track", label: "Track" },
    { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<{ fullName: string; role: string } | null>(null);

    // Scroll state: hide while actively scrolling, show centered capsule on scroll stop
    const [isScrolling, setIsScrolling] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Fetch current active user session without throwing 401 console error when logged out
        fetch("/api/auth/me?optional=1")
            .then((res) => (res.ok ? res.json() : null))
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
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const heroThreshold = 80;

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

                // Smoothly reveal navbar from top when scrolling stops
                scrollTimeoutRef.current = setTimeout(() => {
                    setIsScrolling(false);
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
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                window.history.pushState(null, "", href);
            } else if (id === "contact") {
                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
            }
        }
        setMobileOpen(false);
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
            <div className="relative flex w-full h-12 sm:h-14 items-center justify-between px-4 sm:px-6 md:px-10 lg:px-14 2xl:px-16">
                {/* Left Section: Logo (Vertically centered) */}
                <div className={`flex items-center gap-3 sm:gap-6 pointer-events-auto shrink-0 transition-opacity duration-300 ${isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                    <a
                        href="/"
                        onClick={handleLogoClick}
                        aria-label="Shipnex Home"
                        className="text-2xl font-extrabold font-inter tracking-tighter text-white select-none cursor-pointer transition-opacity hover:opacity-90 flex items-center"
                    >
                        shipnex
                    </a>
                </div>

                {/* Center Section: Dead-centered vertically & horizontally on the EXACT SAME LEVEL */}
                <nav
                    className={`hidden xl:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 gap-5 2xl:gap-7 text-sm items-center backdrop-blur-xl border rounded-2xl px-6 2xl:px-8 h-12 transition-colors duration-300 pointer-events-auto ${isScrolled
                        ? "bg-white/70 border-black/10 text-[#0c0c0e] shadow-lg shadow-black/10"
                        : "bg-white/10 border-white/20 text-white shadow-[0_4px_24px_rgba(0,0,0,0.18)]"
                        }`}
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            data-text={item.label}
                            onClick={(e) => handleNavItemClick(e, item.href)}
                            className={`nav-link-stable whitespace-nowrap transition-all font-outfit hover:font-bold cursor-pointer ${isScrolled ? "text-[#0c0c0e]" : "text-white/90 hover:text-white"}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right Section: Auth & Mobile Menu */}
                <div className="flex items-center gap-2 sm:gap-4 pointer-events-auto shrink-0">
                    {/* Desktop Auth buttons (fade out when scrolled) */}
                    <div className={`hidden xl:flex items-center gap-3 sm:gap-4 transition-opacity duration-300 ${isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/dashboard"
                                    className="inline-flex relative group overflow-hidden rounded-xl border border-white/35 hover:border-white/60 bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-sm px-6 py-2.5 text-sm font-medium text-white tracking-wide transition-all duration-200 shadow-sm select-none items-center justify-center cursor-pointer"
                                >
                                    <span>Dashboard</span>
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="inline-flex text-xs font-medium text-white/80 hover:text-white transition-colors cursor-pointer"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/signup"
                                    className="inline-flex text-xs font-medium text-white/80 hover:text-white transition-colors"
                                >
                                    Sign Up
                                </Link>

                                <Link
                                    href="/login"
                                    className="inline-flex relative group overflow-hidden rounded-xl border border-white/35 hover:border-white/60 bg-white/[0.08] hover:bg-white/[0.15] backdrop-blur-sm px-6 py-2.5 text-sm font-medium text-white tracking-wide transition-all duration-200 shadow-sm select-none items-center justify-center cursor-pointer"
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
                                className={`block w-6 h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-[5px]" : ""}`}
                            />
                            <span
                                className={`block w-6 h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-[5px]" : ""}`}
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
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => handleNavItemClick(e, item.href)}
                                    className="py-2.5 text-sm font-medium text-white/90 hover:text-white border-b border-white/5 last:border-0 cursor-pointer flex items-center justify-between"
                                >
                                    <span>{item.label}</span>
                                    <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-white/40" />
                                </Link>
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
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
