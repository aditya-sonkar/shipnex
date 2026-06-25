import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full py-12 bg-transparent select-none">
            <div className="mx-auto w-full px-8 lg:px-24">

                {/* Horizontal row layout */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-zinc-200/60 dark:border-zinc-800/40 pt-10">

                    {/* Left: Brand Logo Wordmark */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        <Link href="/" className="text-3xl font-heading font-extrabold tracking-tight flex items-center select-none text-foreground">
                            shipnex
                        </Link>
                    </div>

                    {/* Center: Copyright & Trademark Notices */}
                    <div className="text-center flex flex-col items-center gap-1.5">
                        <p className="text-[10px] tracking-widest font-mono text-zinc-400 dark:text-zinc-550 uppercase">
                            © 2026 SHIPNEX. ALL RIGHTS RESERVED.
                        </p>
                        <p className="text-[9px] tracking-widest font-mono text-zinc-500 dark:text-zinc-600 uppercase">
                            SHIPNEX™ IS A TRADEMARK OF ITS RESPECTIVE OWNER.
                        </p>
                    </div>

                    {/* Right: Minimal Social Handles (Exact logo icons from screenshot) */}
                    <div className="flex items-center gap-6 shrink-0 text-zinc-400 dark:text-zinc-500">
                        {/* X Logo */}
                        <a href="#" aria-label="X" className="hover:text-zinc-900 dark:hover:text-white transition-all hover:scale-105">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        {/* Instagram Logo */}
                        <a href="#" aria-label="Instagram" className="hover:text-zinc-900 dark:hover:text-white transition-all hover:scale-105">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </a>
                        {/* YouTube Logo */}
                        <a href="#" aria-label="YouTube" className="hover:text-zinc-900 dark:hover:text-white transition-all hover:scale-105">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 2.78 2.78 0 0 0-.46-5.33z" />
                                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                            </svg>
                        </a>
                        {/* Discord Logo */}
                        <a href="#" aria-label="Discord" className="hover:text-zinc-900 dark:hover:text-white transition-all hover:scale-105">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 127.14 96.36">
                                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.4,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.9-.65,1.76-1.34,2.58-2a75.58,75.58,0,0,0,72.9,0c.82.71,1.68,1.4,2.58,2a68.69,68.69,0,0,1-10.5,5,77.74,77.74,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31.68-18.83C129,54.65,122.58,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
                            </svg>
                        </a>
                    </div>

                </div>

            </div>
        </footer>
    );
}