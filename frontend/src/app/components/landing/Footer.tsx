import Image from "next/image";
import Link from "next/link";

const SERVICE_LINKS = [
    { href: "/#services", label: "Air & Sea Freight" },
    { href: "/#services", label: "Rail & Road Transport" },
    { href: "/#services", label: "Warehousing & Distribution" },
    { href: "/#services", label: "Customs Clearance" },
    { href: "/#services", label: "Last Mile Delivery" },
] as const;

const COMPANY_LINKS = [
    { href: "/#about", label: "About Us" },
    { href: "/#features", label: "Platform Features" },
    { href: "/#journey", label: "Freight Journey" },
    { href: "/#why-us", label: "Why Choose Us" },
    { href: "/#partners", label: "Partner Network" },
] as const;

const PLATFORM_LINKS = [
    { href: "/track", label: "Track Shipment" },
    { href: "/signup", label: "Get Started" },
    { href: "/login", label: "Client Portal" },
    { href: "/#faq", label: "FAQ" },
] as const;

export default function Footer() {
    return (
        <footer id="contact" className="relative z-20 w-full border-t border-neutral-200 bg-white px-4 py-8 font-dm text-black select-none sm:px-8 md:px-10 lg:px-12 lg:py-10">
            <div className="mx-auto w-full max-w-[1720px]">
                {/* Main Content Grid */}
                <div className="grid grid-cols-2 gap-8 pb-12 md:grid-cols-12 lg:gap-12 xl:gap-16">
                    {/* Brand & Contact Column */}
                    <div className="col-span-2 flex flex-col gap-3.5 md:col-span-5">
                        <div className="flex items-center gap-2.5">
                            <Link href="/" className="font-inter text-3xl lg:text-[clamp(28px,1.8vw+10px,36px)] font-extrabold tracking-tight text-black transition-opacity hover:opacity-90">
                                shipnex
                            </Link>
                            <Image
                                src="/images/shipnex-box.svg"
                                alt="ShipNex"
                                width={26}
                                height={26}
                                loading="lazy"
                                className="pointer-events-none select-none"
                            />
                        </div>

                        <p className="max-w-md font-dm text-xs leading-relaxed text-neutral-700 sm:text-sm lg:text-[clamp(13px,0.75vw+4px,16px)]">
                            Autonomous multi-modal freight forwarding, predictive customs clearance, and real-time corridor orchestration across 140+ countries.
                        </p>

                        <div className="pt-0.5 font-inter text-xs lg:text-[clamp(12px,0.7vw+3px,15px)] text-neutral-700">
                            <a href="mailto:support@shipnex.com" className="transition-colors hover:text-black hover:underline underline-offset-4">
                                support@shipnex.com
                            </a>
                        </div>

                        {/* Compact Social Icons */}
                        <div className="flex items-center gap-2 pt-2">
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-all hover:scale-105 hover:bg-black hover:text-white"
                            >
                                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                                </svg>
                            </a>

                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="X"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-all hover:scale-105 hover:bg-black hover:text-white"
                            >
                                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>

                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-all hover:scale-105 hover:bg-black hover:text-white"
                            >
                                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                                </svg>
                            </a>

                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-all hover:scale-105 hover:bg-black hover:text-white"
                            >
                                <svg className="h-3.5 w-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Services Column */}
                    <div className="col-span-1 flex flex-col gap-2.5 md:col-span-3">
                        <h3 className="mb-1 text-xs lg:text-[clamp(11px,0.65vw+3px,14px)] font-semibold uppercase tracking-wider text-neutral-900">
                            Services
                        </h3>
                        {SERVICE_LINKS.map((item) => (
                            <Link key={item.label} href={item.href} className="text-xs text-neutral-700 transition-colors hover:text-black sm:text-sm lg:text-[clamp(12px,0.7vw+4px,15px)]">
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Company Column */}
                    <div className="col-span-1 flex flex-col gap-2.5 md:col-span-2">
                        <h3 className="mb-1 text-xs lg:text-[clamp(11px,0.65vw+3px,14px)] font-semibold uppercase tracking-wider text-neutral-900">
                            Company
                        </h3>
                        {COMPANY_LINKS.map((item) => (
                            <Link key={item.label} href={item.href} className="text-xs text-neutral-700 transition-colors hover:text-black sm:text-sm lg:text-[clamp(12px,0.7vw+4px,15px)]">
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Platform & Support Column */}
                    <div className="col-span-2 flex flex-col gap-2.5 md:col-span-2">
                        <h3 className="mb-1 text-xs lg:text-[clamp(11px,0.65vw+3px,14px)] font-semibold uppercase tracking-wider text-neutral-900">
                            Platform
                        </h3>
                        {PLATFORM_LINKS.map((item) => (
                            <Link key={item.label} href={item.href} className="text-xs text-neutral-700 transition-colors hover:text-black sm:text-sm lg:text-[clamp(12px,0.7vw+4px,15px)]">
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Sub-Footer Strip */}
                <div className="flex flex-col items-start justify-between gap-2 border-t border-neutral-200 pt-6 pr-16 text-xs text-neutral-700 sm:flex-row sm:items-center sm:pr-20 sm:text-sm lg:text-[clamp(12px,0.65vw+3px,14px)]">
                    <p>© {new Date().getFullYear()} ShipNex. All rights reserved.</p>
                    <p className="text-neutral-700">Multi-modal freight, customs &amp; tracking</p>
                </div>
            </div>
        </footer>
    );
}
