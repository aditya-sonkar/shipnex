"use client";

import { useState, useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CheckCircle, Factory, Package, Plane, Truck, Warehouse, Zap } from "lucide-react";

const STAGES = [
    {
        id: "po", icon: Package, label: "Order Placed", line1: "Automated EDI & label sync", line2: "SLA route locked at booking",
        d: { x: 190, y: 165, p: 0.0745 }, m: { x: 80, y: 150, p: 0.0946 },
    },
    {
        id: "origin", icon: Factory, label: "Origin Sort Hub", mLabel: "Origin Hub",
        line1: "AI barcode scan & weigh-in", mLine1: "AI scan & weigh-in complete", line2: "Consolidated for air/sea lane",
        d: { x: 500, y: 425, p: 0.2566 }, m: { x: 165, y: 365, p: 0.2407 },
    },
    {
        id: "customs", icon: Zap, label: "Export Customs",
        line1: "HS code & e-invoice verified", mLine1: "HS code & invoice verified", line2: "Zero-hold digital clearance",
        d: { x: 840, y: 635, p: 0.4339 }, m: { x: 285, y: 555, p: 0.3820 },
    },
    {
        id: "transit", icon: Plane, label: "Freight in Transit",
        line1: "Live GPS & cold-chain feed", mLine1: "Live GPS & sensor feed", line2: "Dynamic weather re-routing",
        d: { x: 880, y: 860, p: 0.5381 }, m: { x: 300, y: 755, p: 0.5085 },
    },
    {
        id: "dest", icon: Warehouse, label: "Destination Hub", line1: "Import manifest pre-cleared", line2: "Cross-docked to local fleet",
        d: { x: 600, y: 1085, p: 0.7003 }, m: { x: 175, y: 955, p: 0.6584 },
    },
    {
        id: "delivery", icon: Truck, label: "Out for Delivery", line1: "Last-mile route optimized", line2: "Live ETA sent to receiver",
        d: { x: 430, y: 1300, p: 0.8240 }, m: { x: 110, y: 1155, p: 0.7913 },
    },
    {
        id: "final", icon: CheckCircle, label: "Delivered",
        line1: "Digital POD & photo captured", mLine1: "Digital POD captured", line2: "Chain-of-custody closed",
        d: { x: 560, y: 1485, p: 0.9257 }, m: { x: 195, y: 1330, p: 0.9146 },
    },
] as const;

type Stage = (typeof STAGES)[number];
type Point = { x: number; y: number };
type ScrollState = { passedCount: number; hoveringId: string | null };

const DESKTOP_PATH =
    "M 220 0 C 220.0 74.3 190.0 94.2 190 165 C 190.0 235.8 391.7 346.7 500 425 C 608.3 503.3 776.7 562.5 840 635 C 903.3 707.5 880.0 785.0 880 860 C 880.0 935.0 675.0 1011.7 600 1085 C 525.0 1158.3 430.0 1233.3 430 1300 C 430.0 1366.7 535.0 1438.3 560 1485 C 585.0 1531.7 580.0 1585.0 580 1650";

const MOBILE_PATH =
    "M 95 0 C 95.0 67.5 80.0 89.2 80 150 C 80.0 210.8 130.8 297.5 165 365 C 199.2 432.5 262.5 490.0 285 555 C 307.5 620.0 300.0 688.3 300 755 C 300.0 821.7 206.7 888.3 175 955 C 143.3 1021.7 110.0 1092.5 110 1155 C 110.0 1217.5 179.2 1285.8 195 1330 C 210.8 1374.2 205.0 1415.0 205 1465";

const TRACKS = {
    desktop: {
        visiblePath: DESKTOP_PATH,
        motionPath: `M 220 -90 L 220 0 ${DESKTOP_PATH.replace(/^M\s+220\s+0\s+/, "")} L 580 1740`,
        viewBox: "0 0 1200 1650",
        maxW: "max-w-[1200px]",
        strokeW: 4,
        dash: "1.5 8",
        boxStartX: 220,
        boxW: 128,
        boxH: 133,
        startPad: 90,
        hitRadius: 46,
        maxY: 1650,
        scrollStart: "top 70%",
        scrollEnd: "bottom 30%",
        node: {
            outerR: 25, innerR: 21, ringR: 30.5, ringStroke: 1.25, iconSize: 17, badgeMinW: 116, charW: 8.6, badgePadW: 40, badgeH: 36, badgeY: 44, rx: 7,
            badgeFs: "13.5", calloutGap: 14, cardH: 58, padX: 16, cardCharW: 6.4, cardRx: 4, fs1: "12.5", fs2: "11", ty1: 23, ty2: 41, midX: 600,
        },
    },
    mobile: {
        visiblePath: MOBILE_PATH,
        motionPath: `M 95 -60 L 95 0 ${MOBILE_PATH.replace(/^M\s+95\s+0\s+/, "")} L 205 1525`,
        viewBox: "0 0 390 1465",
        maxW: "max-w-[390px]",
        strokeW: 3,
        dash: "1.5 7",
        boxStartX: 95,
        boxW: 82,
        boxH: 85,
        startPad: 60,
        hitRadius: 34,
        maxY: 1465,
        scrollStart: "top 65%",
        scrollEnd: "bottom 35%",
        node: {
            outerR: 18, innerR: 15, ringR: 22.5, ringStroke: 1.0, iconSize: 12, badgeMinW: 88, charW: 6.9, badgePadW: 24, badgeH: 27, badgeY: 31, rx: 5,
            badgeFs: "10.5", calloutGap: 10, cardH: 44, padX: 11, cardCharW: 4.9, cardRx: 3, fs1: "9.5", fs2: "8.5", ty1: 17.5, ty2: 31.5, midX: 195,
        },
    },
} as const;

const INTER_FONT = { fontFamily: "var(--font-inter), sans-serif" } as const;
const INITIAL_CALLOUT_STYLE = { opacity: 0, visibility: "hidden" } as const;

function getScrollState(boxPt: Point | null, isMobile: boolean): ScrollState {
    if (!boxPt) return { passedCount: 0, hoveringId: null };
    const { hitRadius, maxY } = isMobile ? TRACKS.mobile : TRACKS.desktop;

    let passedCount = 0;
    let hoveringId: string | null = null;
    let closestDist = Infinity;

    for (const s of STAGES) {
        const pt = isMobile ? s.m : s.d;
        if (boxPt.y >= pt.y - hitRadius) passedCount += 1;
        if (boxPt.y >= 0 && boxPt.y <= maxY) {
            const dist = Math.hypot(boxPt.x - pt.x, boxPt.y - pt.y);
            if (dist <= hitRadius && dist < closestDist) {
                closestDist = dist;
                hoveringId = s.id;
            }
        }
    }
    return { passedCount, hoveringId };
}

function buildMotionTimeline(
    boxEl: SVGGElement,
    motionEl: SVGPathElement,
    secEl: HTMLElement,
    isMobile: boolean,
    onProgress: (pt: Point | null) => void
) {
    const cfg = isMobile ? TRACKS.mobile : TRACKS.desktop;
    const totalLen = motionEl.getTotalLength();
    const visibleLen = totalLen - cfg.startPad * 2;

    const tl = gsap.timeline({
        onUpdate: () => {
            const pt = totalLen > 0 ? motionEl.getPointAtLength(tl.progress() * totalLen) : null;
            onProgress(pt ? { x: pt.x, y: pt.y } : null);
        },
        scrollTrigger: { trigger: secEl, start: cfg.scrollStart, end: cfg.scrollEnd, scrub: 0.6 },
    });

    const innerImg = boxEl.querySelector("image");
    gsap.set(boxEl, { transformOrigin: "50% 50%", autoAlpha: 1 });
    if (innerImg) gsap.set(innerImg, { transformOrigin: "50% 50%", scale: 1 });

    tl.to(boxEl, { motionPath: { path: motionEl, align: motionEl, alignOrigin: [0.5, 0.5], autoRotate: false }, ease: "none", duration: 10 }, 0);

    if (innerImg && totalLen > 0) {
        for (const s of STAGES) {
            const stageP = (cfg.startPad + (isMobile ? s.m.p : s.d.p) * visibleLen) / totalLen;
            const t = Math.max(0, stageP * 10 - 0.2);
            tl.to(innerImg, { scale: 1.15, duration: 0.2, ease: "sine.inOut" }, t)
                .to(innerImg, { scale: 1, duration: 0.2, ease: "sine.inOut" }, t + 0.2);
        }
    }
}

function StageNode({ stage, isHit, showLines, isMobile }: { stage: Stage; isHit: boolean; showLines: boolean; isMobile: boolean }) {
    const cfg = (isMobile ? TRACKS.mobile : TRACKS.desktop).node;
    const pos = isMobile ? stage.m : stage.d;
    const label = isMobile && "mLabel" in stage ? stage.mLabel : stage.label;
    const line1 = isMobile && "mLine1" in stage ? stage.mLine1 : stage.line1;
    const Icon = stage.icon;

    const badgeW = Math.max(cfg.badgeMinW, label.length * cfg.charW + cfg.badgePadW);
    const dropBelowMobilePo = isMobile && stage.id === "po";
    const alignLeft = !dropBelowMobilePo && (pos.x > cfg.midX || (!isMobile && stage.id === "origin"));
    const dir = alignLeft ? -1 : 1;
    const anchorX = dir * (cfg.ringR + cfg.calloutGap);
    const cardW = Math.round(Math.max(line1.length, stage.line2.length) * cfg.cardCharW + cfg.padX * 2);
    const cardX = dropBelowMobilePo ? -46 : alignLeft ? anchorX - cardW : anchorX;
    const cardY = dropBelowMobilePo ? cfg.badgeY + cfg.badgeH + 8 : -cfg.cardH / 2;
    const slideOffset = dropBelowMobilePo ? -18 : -dir * 22;

    const cardRef = useRef<SVGGElement>(null);
    const prevShowRef = useRef(false);

    useEffect(() => {
        const cardEl = cardRef.current;
        if (!cardEl) return;

        if (!showLines && !prevShowRef.current) {
            return;
        }

        const wasHidden = !prevShowRef.current;
        prevShowRef.current = showLines;
        gsap.killTweensOf(cardEl);
        if (showLines && wasHidden) {
            gsap.fromTo(
                cardEl,
                { x: slideOffset, autoAlpha: 0, force3D: false },
                { x: 0, autoAlpha: 1, duration: 0.36, ease: "power3.out", force3D: false, overwrite: "auto" }
            );
        } else {
            gsap.to(cardEl, {
                x: showLines ? 0 : slideOffset,
                autoAlpha: showLines ? 1 : 0,
                duration: showLines ? 0.36 : 0.22,
                ease: showLines ? "power3.out" : "power2.in",
                force3D: false,
                overwrite: "auto",
            });
        }

        return () => {
            gsap.killTweensOf(cardEl);
        };
    }, [showLines, slideOffset]);

    const highlighted = isHit || showLines;

    return (
        <g transform={`translate(${pos.x},${pos.y})`} style={INTER_FONT} className="pointer-events-none">
            <circle
                r={cfg.ringR} fill="none" stroke="#fde047" strokeWidth={cfg.ringStroke}
                style={{ opacity: highlighted ? 1 : 0, transform: highlighted ? "scale(1)" : "scale(0.85)" }}
                className="transition-all duration-300 ease-out"
            />
            <circle r={cfg.outerR} fill="#FDE68A" className="drop-shadow-sm" />
            <circle r={cfg.innerR} fill="#ffffff" />
            <g transform={`translate(${-cfg.iconSize / 2},${-cfg.iconSize / 2})`}>
                <Icon
                    size={cfg.iconSize}
                    className="text-[#E22D22] stroke-[2] transition-colors duration-300"
                    fill={highlighted ? "rgba(226, 45, 34, 0.16)" : "none"}
                />
            </g>

            <rect
                x={-badgeW / 2} y={cfg.badgeY} width={badgeW} height={cfg.badgeH} rx={cfg.rx}
                fill={highlighted ? "#F0EA6F" : "rgba(255, 255, 255, 0.10)"}
                stroke={highlighted ? "#f59e0b" : "#facc15"}
                strokeWidth={highlighted ? 2 : 1.25}
                className="transition-colors duration-300 drop-shadow-sm"
            />
            <text
                x={0} y={cfg.badgeY + cfg.badgeH / 2} textAnchor="middle" dominantBaseline="central"
                fill={highlighted ? "#09090b" : "#ffffff"} fillOpacity={highlighted ? 1 : 0.98}
                fontSize={cfg.badgeFs} fontWeight="700"
            >
                {label}
            </text>

            <g ref={cardRef} style={INITIAL_CALLOUT_STYLE}>
                <rect x={cardX} y={cardY} width={cardW} height={cfg.cardH} rx={cfg.cardRx} fill="#ffffff" fillOpacity={1} className="drop-shadow-md" />
                <text x={cardX + cfg.padX} y={cardY + cfg.ty1} fill="#09090b" fontSize={cfg.fs1} fontWeight="600">{line1}</text>
                <text x={cardX + cfg.padX} y={cardY + cfg.ty2} fill="#52525b" fontSize={cfg.fs2} fontWeight="400">{stage.line2}</text>
            </g>
        </g>
    );
}

function RouteSvg({
    isMobile, motionRef, boxRef, scroll,
}: {
    isMobile: boolean;
    motionRef: RefObject<SVGPathElement | null>;
    boxRef: RefObject<SVGGElement | null>;
    scroll: ScrollState;
}) {
    const cfg = isMobile ? TRACKS.mobile : TRACKS.desktop;
    return (
        <div className="relative z-20 w-full flex justify-center overflow-visible pointer-events-none">
            <svg viewBox={cfg.viewBox} className={`w-full ${cfg.maxW} overflow-visible h-auto`} preserveAspectRatio="xMidYMin meet">
                <path ref={motionRef} d={cfg.motionPath} fill="none" stroke="none" />
                <path d={cfg.visiblePath} fill="none" stroke="#B2BEB5" strokeWidth={cfg.strokeW} strokeDasharray={cfg.dash} strokeLinecap="butt" strokeLinejoin="round" />
                <g ref={boxRef} transform={`translate(${cfg.boxStartX}, -200)`}>
                    <image href="/images/shipnex-box.svg" x={-cfg.boxW / 2} y={-cfg.boxH / 2} width={cfg.boxW} height={cfg.boxH} />
                </g>
                {STAGES.map((s, idx) => (
                    <StageNode key={s.id} stage={s} isHit={idx < scroll.passedCount} showLines={scroll.hoveringId === s.id} isMobile={isMobile} />
                ))}
            </svg>
        </div>
    );
}

export interface JourneyInteractiveProps {
    sectionRef: RefObject<HTMLElement | null>;
    variant: "desktop" | "mobile";
}

export default function JourneyInteractive({ sectionRef, variant }: JourneyInteractiveProps) {
    const motionRef = useRef<SVGPathElement>(null);
    const boxRef = useRef<SVGGElement>(null);
    const [scroll, setScroll] = useState<ScrollState>({ passedCount: 0, hoveringId: null });
    const isMobile = variant === "mobile";

    useEffect(() => {
        const secEl = sectionRef.current;
        const motionEl = motionRef.current;
        const boxEl = boxRef.current;
        if (!secEl || !motionEl || !boxEl) return;

        gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
        const ctx = gsap.context(() => {
            buildMotionTimeline(boxEl, motionEl, secEl, isMobile, (pt) => {
                const next = getScrollState(pt, isMobile);
                setScroll((prev) => (prev.passedCount === next.passedCount && prev.hoveringId === next.hoveringId ? prev : next));
            });
        }, secEl);

        const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
        return () => {
            clearTimeout(refreshTimer);
            ctx.revert();
        };
    }, [sectionRef, isMobile]);

    return <RouteSvg isMobile={isMobile} motionRef={motionRef} boxRef={boxRef} scroll={scroll} />;
}

