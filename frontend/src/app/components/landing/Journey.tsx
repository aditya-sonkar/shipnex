"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import {
    Package, MapPin, Factory, Zap, Eye, Warehouse,
    Plane, FileText, Truck, ShieldCheck, CheckCircle
} from "lucide-react";

// Desktop checkpoint coordinates and milestones
const DESKTOP_STAGES = [
    { id: "po", x: 75, y: 280, label: "Order Placed", progress: 0.077, icon: Package },
    { id: "pickup", x: 150, y: 630, label: "Package Pickup", progress: 0.160, icon: MapPin },
    { id: "source", x: 300, y: 940, label: "Origin Hub", progress: 0.240, icon: Factory },
    { id: "customs", x: 550, y: 1200, label: "Export Customs", progress: 0.323, icon: Zap },
    { id: "vis", x: 770, y: 1420, label: "In Transit", progress: 0.395, icon: Eye },
    { id: "wh", x: 940, y: 1640, label: "Warehouse Hub", progress: 0.459, icon: Warehouse },
    { id: "freight", x: 950, y: 2000, label: "Air & Sea Freight", progress: 0.543, icon: Plane },
    { id: "import", x: 860, y: 2360, label: "Import Clearance", progress: 0.629, icon: FileText },
    { id: "dest_wh", x: 690, y: 2700, label: "Destination Hub", progress: 0.716, icon: Warehouse },
    { id: "delivery", x: 580, y: 3020, label: "Out for Delivery", progress: 0.795, icon: Truck },
    { id: "proof", x: 580, y: 3320, label: "Delivery Proof", progress: 0.864, icon: ShieldCheck },
    { id: "final", x: 610, y: 3580, label: "Delivered", progress: 0.925, icon: CheckCircle },
];

const DESKTOP_PATH = `
M 240 0
C 190 70 75 150 75 280
C 75 400 100 520 150 630
C 180 735 230 840 300 940
C 380 1040 470 1120 550 1200
C 630 1280 700 1350 770 1420
C 840 1490 890 1560 940 1640
C 965 1740 965 1880 950 2000
C 935 2120 905 2240 860 2360
C 810 2480 745 2590 690 2700
C 635 2810 580 2910 580 3020
C 580 3120 580 3220 580 3320
C 580 3410 595 3500 610 3580
C 625 3680 645 3780 670 3900
`;

// Mobile checkpoint coordinates and milestones
const MOBILE_STAGES = [
    { id: "po", x: 60, y: 170, label: "Order Placed", progress: 0.059, icon: Package },
    { id: "pickup", x: 60, y: 460, label: "Package Pickup", progress: 0.151, icon: MapPin },
    { id: "source", x: 175, y: 730, label: "Origin Hub", progress: 0.243, icon: Factory },
    { id: "customs", x: 255, y: 920, label: "Export Customs", progress: 0.309, icon: Zap },
    { id: "vis", x: 270, y: 1160, label: "In Transit", progress: 0.384, icon: Eye },
    { id: "wh", x: 215, y: 1400, label: "Warehouse Hub", progress: 0.462, icon: Warehouse },
    { id: "freight", x: 125, y: 1640, label: "Air & Sea Freight", progress: 0.543, icon: Plane },
    { id: "import", x: 95, y: 1880, label: "Import Clearance", progress: 0.619, icon: FileText },
    { id: "dest_wh", x: 155, y: 2120, label: "Destination Hub", progress: 0.697, icon: Warehouse },
    { id: "delivery", x: 245, y: 2360, label: "Out for Delivery", progress: 0.778, icon: Truck },
    { id: "proof", x: 220, y: 2600, label: "Delivery Proof", progress: 0.854, icon: ShieldCheck },
    { id: "final", x: 195, y: 2820, label: "Delivered", progress: 0.924, icon: CheckCircle },
];

const MOBILE_PATH = `
M 140 0
C 110 55 75 110 60 170
C 45 250 45 360 60 460
C 80 560 125 650 175 730
C 210 790 245 860 255 920
C 265 1000 275 1080 270 1160
C 265 1240 245 1320 215 1400
C 175 1480 135 1560 125 1640
C 115 1720 90 1800 95 1880
C 100 1960 130 2040 155 2120
C 180 2200 230 2280 245 2360
C 255 2440 245 2520 220 2600
C 200 2680 195 2750 195 2820
C 195 2890 210 2970 225 3060
`;

// Motion timeline for box gliding across checkpoints
function buildStepMotionTimeline({
    boxEl,
    pathEl,
    stages,
    secEl,
    startPos,
    endPos,
    onProgressUpdate,
}: {
    boxEl: SVGGElement;
    pathEl: SVGPathElement;
    stages: typeof DESKTOP_STAGES;
    secEl: HTMLElement;
    startPos: string;
    endPos: string;
    onProgressUpdate: (progress: number) => void;
}) {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: secEl,
            start: startPos,
            end: endPos,
            scrub: 0.6,
            onUpdate: (s) => onProgressUpdate(s.progress),
        },
    });

    const innerImg = boxEl.querySelector("image");

    // Immediately hide the box on initialization so it never flashes at (0, 0)
    gsap.set(boxEl, { transformOrigin: "50% 50%", autoAlpha: 0 });
    if (innerImg) {
        gsap.set(innerImg, { transformOrigin: "50% 50%", scale: 1 });
    }

    // 1. Single continuous, uninterrupted glide along the entire path — NO STOPS AT ALL
    tl.to(boxEl, {
        motionPath: {
            path: pathEl,
            align: pathEl,
            alignOrigin: [0.5, 0.5],
            autoRotate: false,
        },
        ease: "none",
        duration: 10,
    }, 0);

    // Fade the box in smoothly once user starts scrolling into Journey (stays 100% hidden at top seam)
    tl.fromTo(boxEl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, ease: "power1.out" }, 0.05);

    // Fade the box out as it glides behind Features so it seamlessly disappears
    tl.to(boxEl, { autoAlpha: 0, duration: 0.35, ease: "power1.in" }, 9.6);

    // 2. Subtle pulse when passing over each checkpoint without slowing down or stopping
    if (innerImg) {
        stages.forEach((st) => {
            const timeAtPoint = st.progress * 10;
            const breathDuration = 0.4;
            const startTime = Math.max(0, timeAtPoint - breathDuration / 2);

            tl.to(innerImg, {
                scale: 1.15,
                duration: breathDuration / 2,
                ease: "sine.inOut",
            }, startTime);

            tl.to(innerImg, {
                scale: 1,
                duration: breathDuration / 2,
                ease: "sine.inOut",
            }, startTime + breathDuration / 2);
        });
    }

    return tl;
}

export default function Journey() {
    const sectionRef = useRef<HTMLElement>(null);
    const desktopBoxRef = useRef<SVGGElement>(null);
    const mobileBoxRef = useRef<SVGGElement>(null);
    const [activeProgress, setActiveProgress] = useState(0);

    useEffect(() => {
        if (typeof window === "undefined") return;

        gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

        const isMobile = () => window.innerWidth < 768;

        const setupDesktop = () => {
            if (isMobile()) return null;
            const pathEl = document.getElementById("desktopMotionPath") as SVGPathElement | null;
            const boxEl = desktopBoxRef.current;
            const secEl = sectionRef.current;
            if (!pathEl || !boxEl || !secEl) return null;

            return gsap.context(() => {
                buildStepMotionTimeline({
                    boxEl,
                    pathEl,
                    stages: DESKTOP_STAGES,
                    secEl,
                    startPos: "top 60%",
                    endPos: "bottom bottom",
                    onProgressUpdate: (p) => setActiveProgress(p),
                });
            }, secEl);
        };

        const setupMobile = () => {
            if (!isMobile()) return null;
            const pathEl = document.getElementById("mobileMotionPath") as SVGPathElement | null;
            const boxEl = mobileBoxRef.current;
            const secEl = sectionRef.current;
            if (!pathEl || !boxEl || !secEl) return null;

            return gsap.context(() => {
                buildStepMotionTimeline({
                    boxEl,
                    pathEl,
                    stages: MOBILE_STAGES,
                    secEl,
                    startPos: "top 35%",
                    endPos: "bottom bottom",
                    onProgressUpdate: (p) => setActiveProgress(p),
                });
            }, secEl);
        };

        let dCtx = setupDesktop();
        let mCtx = setupMobile();

        const onResize = () => {
            dCtx?.revert();
            mCtx?.revert();
            dCtx = setupDesktop();
            mCtx = setupMobile();
            ScrollTrigger.refresh();
        };

        window.addEventListener("resize", onResize);
        const t = setTimeout(() => ScrollTrigger.refresh(), 300);

        return () => {
            clearTimeout(t);
            window.removeEventListener("resize", onResize);
            dCtx?.revert();
            mCtx?.revert();
        };
    }, []);

    // Checkpoint node with glow, icon and label
    const RenderNode = ({ s, isMobile = false }: { s: typeof DESKTOP_STAGES[0]; isMobile?: boolean }) => {
        const Icon = s.icon;
        const hit = activeProgress >= s.progress - (isMobile ? 0.035 : 0.025);
        const outerR = isMobile ? 20 : 28;
        const innerR = isMobile ? 14 : 19;
        const iconOffset = isMobile ? -6 : -8;
        const iconSize = isMobile ? 12 : 16;
        const foWidth = isMobile ? 135 : 210;
        const foX = -foWidth / 2;
        const foY = isMobile ? 28 : 44;

        return (
            <g transform={`translate(${s.x},${s.y})`} className="pointer-events-auto">
                <circle
                    r={outerR}
                    fill="#132438"
                    stroke={hit ? "#fde047" : "#fbbf24"}
                    strokeWidth={hit ? "3.5" : "2"}
                    filter={isMobile ? "url(#mobileHaloGlow)" : "url(#haloGlow)"}
                    className="transition-all duration-300 drop-shadow-md"
                />
                <circle r={innerR} fill="#ffffff" className="drop-shadow-sm" />
                <g transform={`translate(${iconOffset},${iconOffset})`} className="pointer-events-none">
                    <Icon size={iconSize} className="text-[#353A95] stroke-[2.2]" />
                </g>
                <foreignObject x={foX} y={foY} width={foWidth} height="46">
                    <div className="flex justify-center w-full">
                        <span
                            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-sm font-outfit font-bold whitespace-nowrap transition-all duration-300 ${isMobile ? "text-[9.5px]" : "text-xs"
                                } ${hit
                                    ? "bg-[#F0EA6F] text-zinc-950 border border-amber-300 shadow-sm scale-105"
                                    : "bg-white/[0.08] backdrop-blur-md text-white/90 border border-white/20"
                                }`}
                        >
                            {s.label}
                        </span>
                    </div>
                </foreignObject>
            </g>
        );
    };

    return (
        <section
            ref={sectionRef}
            id="journey"
            className="relative z-20 w-full bg-[#353A95] text-white select-none overflow-visible"
        >
            {/* Desktop view */}
            <div className="hidden md:block relative pb-0">
                <div className="absolute top-20 right-8 lg:right-20 max-w-lg lg:max-w-2xl xl:max-w-3xl z-20 pointer-events-none">
                    <h2 className="font-bastardo text-[10vw] sm:text-[3.5rem] lg:text-[4.4rem] xl:text-[5rem] font-extralight leading-[1.04] text-white drop-shadow-md tracking-tight">
                        Next-Gen Freight <span className="text-[#fde047]">Intelligence</span>
                        <br />Orchestrated Globally
                    </h2>
                    <p className="font-outfit mt-5 text-base lg:text-lg text-white/85 leading-relaxed max-w-xl">
                        Autonomous multi-modal telemetry, predictive customs clearance, and self-healing delivery corridors across 140+ countries.
                    </p>
                    <a href="#features" className="font-outfit pointer-events-auto mt-6 inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-white text-zinc-950 font-bold text-xs uppercase tracking-widest hover:bg-[#fde047] transition-all shadow-2xl">
                        Explore Platform »
                    </a>
                </div>

                {/* Left watermark */}
                <div className="absolute top-[600px] left-8 lg:left-14 pointer-events-none select-none -z-10 flex flex-col leading-[0.80]">
                    <span className="text-[16vw] font-sans font-black uppercase text-white/5 tracking-tighter whitespace-nowrap">
                        Autonomous
                    </span>
                    <span className="text-[16vw] font-sans font-black uppercase text-white/5 tracking-tighter whitespace-nowrap">
                        Velocity
                    </span>
                </div>

                {/* Right watermark */}
                <div className="absolute top-[2200px] right-8 lg:right-14 text-right pointer-events-none select-none -z-10 flex flex-col items-end leading-[0.80]">
                    <span className="text-[16vw] font-sans font-black uppercase text-white/5 tracking-tighter whitespace-nowrap">
                        Global
                    </span>
                    <span className="text-[16vw] font-sans font-black uppercase text-white/5 tracking-tighter whitespace-nowrap">
                        Corridors
                    </span>
                </div>

                {/* SVG Route */}
                <div className="flex justify-center overflow-visible pointer-events-none">
                    <svg
                        id="journeySVG"
                        viewBox="0 0 1200 3900"
                        className="w-full max-w-[1200px] overflow-visible"
                        style={{ height: "auto" }}
                        preserveAspectRatio="xMidYMin meet"
                    >
                        <defs>
                            <filter id="haloGlow" x="-60%" y="-60%" width="220%" height="220%">
                                <feGaussianBlur stdDeviation="5" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        <path id="desktopMotionPath" d={DESKTOP_PATH} fill="none" stroke="none" />
                        <path d={DESKTOP_PATH} fill="none" stroke="#B2BEB5" strokeWidth="4" strokeDasharray="1.5 8" strokeLinecap="butt" strokeLinejoin="round" />

                        {/* 3D Cargo Box */}
                        <g
                            ref={desktopBoxRef}
                            className="pointer-events-none"
                            style={{ opacity: 0, visibility: "hidden" }}
                            transform="translate(240, -300)"
                        >
                            <image href="/images/shipnex-box.svg" x="-64" y="-66.5" width="128" height="133" />
                        </g>

                        {/* Checkpoints */}
                        {DESKTOP_STAGES.map((s) => (
                            <RenderNode key={s.id} s={s} />
                        ))}
                    </svg>
                </div>
            </div>

            {/* Mobile view */}
            <div className="md:hidden relative pb-0">
                <div className="absolute top-[120px] right-3 sm:right-5 w-[65%] max-w-[245px] sm:max-w-[270px] z-10 text-right pointer-events-none">
                    <h2 className="font-sans text-[26px] sm:text-[32px] font-black leading-[1.0] text-white drop-shadow-2xl tracking-tight">
                        Next-Gen Freight
                        <br />
                        <span className="text-[#fde047]">Intelligence</span>
                        <br />
                        Orchestrated
                        <br />
                        <span className="text-white">Globally</span>
                    </h2>
                    <p className="font-outfit mt-3 text-[11px] sm:text-[12.5px] text-white/85 leading-snug max-w-[220px] ml-auto">
                        Autonomous multi-modal telemetry and self-healing delivery corridors across nations
                    </p>
                    <div className="mt-3.5 flex justify-end">
                        <a
                            href="#features"
                            className="pointer-events-auto inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-full bg-white text-[#353A95] font-outfit font-bold text-xs tracking-wide hover:bg-zinc-100 transition-all shadow-xl"
                        >
                            <span>Explore Platform</span>
                            <span className="font-bold tracking-tighter text-sm">&gt;&gt;</span>
                        </a>
                    </div>
                </div>

                <div className="relative z-20 w-full overflow-visible pointer-events-none flex justify-center">
                    <svg
                        viewBox="0 0 390 3060"
                        className="w-full max-w-[390px] overflow-visible"
                        style={{ height: "auto" }}
                        preserveAspectRatio="xMidYMin meet"
                    >
                        <defs>
                            <filter id="mobileHaloGlow" x="-60%" y="-60%" width="220%" height="220%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        <path id="mobileMotionPath" d={MOBILE_PATH} fill="none" stroke="none" />
                        <path d={MOBILE_PATH} fill="none" stroke="#B2BEB5" strokeWidth="3" strokeDasharray="1.5 7" strokeLinecap="butt" strokeLinejoin="round" />

                        {/* Mobile Cargo Box */}
                        <g
                            ref={mobileBoxRef}
                            className="pointer-events-none"
                            style={{ opacity: 0, visibility: "hidden" }}
                            transform="translate(140, -300)"
                        >
                            <image href="/images/shipnex-box.svg" x="-41" y="-42.5" width="82" height="85" />
                        </g>

                        {/* Checkpoints */}
                        {MOBILE_STAGES.map((s) => (
                            <RenderNode key={s.id} s={s} isMobile />
                        ))}
                    </svg>
                </div>
            </div>
        </section>
    );
}
