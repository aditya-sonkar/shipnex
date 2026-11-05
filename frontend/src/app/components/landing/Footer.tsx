import Link from "next/link";

export default function Footer() {
    const mainLinks = [
        { label: "Solutions.", href: "/#solutions" },
        { label: "Journey.", href: "/#journey" },
        { label: "Features.", href: "/#features" },
        { label: "Pricing.", href: "/#pricing" },
        { label: "Strategic Advantage.", href: "/#purpose" },
        { label: "Contact Us.", href: "/#contact" },
    ];

    const legalLinks = [
        { label: "Privacy Policy.", href: "/privacy" },
        { label: "Terms of Use.", href: "/terms" },
        { label: "Standard Trading Conditions.", href: "/trading-conditions" },
        { label: "Copyrights.", href: "/copyrights" },
    ];

    return (
        <footer id="contact" className="w-full bg-[#353A95] text-white select-none px-6 sm:px-12 lg:px-20 pt-16 sm:pt-24 pb-12 sm:pb-16 relative z-20">
            <div className="mx-auto w-full max-w-screen-2xl">
                {/* Brand description and logo */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10 sm:gap-14 mb-16 sm:mb-20">
                    <p className="max-w-xl text-white/95 text-sm sm:text-base leading-relaxed font-outfit font-normal">
                        We operate in 12 countries with 85+ locations, using expert logistics and digital platforms to provide fast, transparent, and cost-effective freight, warehousing, customs, and delivery services worldwide.
                    </p>

                    <div className="flex items-center gap-3 shrink-0 self-start lg:self-auto">
                        <Link href="/" className="text-4xl sm:text-5xl lg:text-6xl font-black font-gangster tracking-tight text-white hover:opacity-95 transition-opacity">
                            shipnex
                        </Link>
                        <img
                            src="/images/shipnex-box.svg"
                            alt="ShipNex Cube"
                            className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-md select-none pointer-events-none"
                        />
                    </div>
                </div>

                {/* Navigation links */}
                <div className="space-y-4 mb-16 sm:mb-24">
                    <div className="flex flex-wrap items-center gap-x-8 sm:gap-x-12 gap-y-3.5 text-sm sm:text-base font-semibold text-white font-outfit">
                        {mainLinks.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="hover:underline underline-offset-4 transition-all"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-10 gap-y-2.5 text-xs sm:text-sm font-normal text-white/90 font-outfit pt-1">
                        {legalLinks.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="hover:underline underline-offset-4 transition-all text-white/85 hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Social icons and copyright */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pt-4">
                    <div className="grid grid-cols-2 gap-3.5">
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="w-10 h-10 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md cursor-pointer"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                            </svg>
                        </a>

                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="w-10 h-10 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md cursor-pointer"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                            </svg>
                        </a>

                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                            className="w-10 h-10 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md cursor-pointer"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26.24 26.24 0 0 0 2 12c0 1.62.14 3.23.42 4.81a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77c.28-1.58.42-3.19.42-4.81 0-1.62-.14-3.23-.42-4.81zM10 15V9l5.2 3L10 15z" />
                            </svg>
                        </a>

                        <a
                            href="https://x.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="X"
                            className="w-10 h-10 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>

                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="w-10 h-10 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md cursor-pointer"
                        >
                            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </a>

                        <a
                            href="#"
                            aria-label="Mobile App"
                            className="w-10 h-10 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md cursor-pointer"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M3.6 2.3c-.2.2-.3.6-.3 1.1v17.2c0 .5.1.9.3 1.1l9.1-9.6L3.6 2.3zm1.6-.7l8.4 4.8-2.6 2.7-5.8-7.5zm0 20.8l5.8-7.5 2.6 2.7-8.4 4.8zm9.3-5.3l2.8-1.6c1.1-.6 1.1-1.6 0-2.3l-2.8-1.6-1.7 1.8 1.7 3.7z" />
                            </svg>
                        </a>
                    </div>

                    <div className="text-left sm:text-right text-xs sm:text-sm font-outfit text-white/95 font-medium leading-relaxed">
                        <p>© 2026 — Copyright All</p>
                        <p>Rights reserved</p>
                    </div>
                </div>

            </div>
        </footer>
    );
}
