"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import type { Partner, PartnersMapProps } from "./PartnersMap";

const DEFAULT_ZOOM = 1.65;

const DEFAULT_PARTNERS: Partner[] = [
    {
        id: "fallback-1",
        name: "Change Networks",
        city: "Navi Mumbai, IN",
        lat: 19.111677444460938,
        lng: 73.01596085488812,
        hubType: "Enterprise ICT Partner",
    },
    {
        id: "fallback-2",
        name: "Port of Rotterdam",
        city: "Rotterdam, NL",
        lat: 51.96481046283217,
        lng: 4.036951519373967,
        hubType: "European Sea Gateway",
    },
    {
        id: "fallback-3",
        name: "DP World Jebel Ali",
        city: "Dubai, AE",
        lat: 24.997105716723294,
        lng: 55.08178207955978,
        hubType: "MENA Free Zone Port",
    },
    {
        id: "fallback-4",
        name: "Flexport HQ",
        city: "San Francisco, US",
        lat: 37.79401869642545,
        lng: -122.39799890129491,
        hubType: "Trans-Pacific Supply Chain",
    },
];

export default function Partners() {
    const sectionRef = useRef<HTMLElement>(null);
    const [partners, setPartners] = useState<Partner[]>(DEFAULT_PARTNERS);
    const [selected, setSelected] = useState<Partner | null>(null);
    const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
    const [shouldLoadMap, setShouldLoadMap] = useState(false);
    const [MapComponent, setMapComponent] = useState<ComponentType<PartnersMapProps> | null>(null);
    const [focusRequestId, setFocusRequestId] = useState(0);

    // Defer heavy MapLibre GL WebGL initialization until user scrolls near #partners
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || shouldLoadMap) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting && entry.boundingClientRect.top < window.innerHeight + 900)) {
                    setShouldLoadMap(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "900px 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [shouldLoadMap]);

    useEffect(() => {
        if (!shouldLoadMap) return;

        let active = true;
        if (!MapComponent) {
            import("./PartnersMap").then((mod) => {
                if (active) setMapComponent(() => mod.default);
            });
        }

        const controller = new AbortController();

        fetch("/api/partners", { signal: controller.signal })
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setPartners(data);
                }
            })
            .catch(() => {
                // Keep fallback hubs visible when backend is unreachable
            });

        return () => {
            active = false;
            controller.abort();
        };
    }, [shouldLoadMap, MapComponent]);

    const handleSelectPartner = (partner: Partner) => {
        setShouldLoadMap(true);
        setSelected(partner);
        setFocusRequestId((n) => n + 1);
    };

    return (
        <section id="partners" ref={sectionRef} className="bg-white px-4 py-8 text-black sm:px-8 md:px-10 lg:px-12 lg:py-12">
            {/* Header */}
            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:items-end lg:mb-14">
                <div>
                    <span className="mb-4 flex items-center gap-2 text-xs font-medium tracking-wider text-neutral-600 uppercase">
                        <span className="h-1.5 w-1.5 bg-neutral-600" />
                        OUR PARTNERS
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[4vw] font-semibold leading-[1.05] tracking-[-0.04em]">
                        Global partner network.
                    </h2>
                </div>

                <p className="max-w-md text-sm sm:text-base leading-[1.6] text-neutral-700 md:ml-auto md:text-right">
                    Enterprise clients, port terminals, and freight partners connected across 6 continents.
                </p>
            </div>

            {/* Directory Sidebar + Interactive Map */}
            <div className="grid grid-cols-1 lg:grid-cols-[310px_1fr] border border-neutral-200 bg-white">
                {/* Partner List (Click to fly) */}
                <div
                    data-lenis-prevent
                    className="order-2 lg:order-1 max-h-[240px] lg:h-[550px] lg:max-h-none overflow-y-auto divide-y divide-neutral-200 border-t lg:border-t-0 lg:border-r border-neutral-200"
                >
                    {partners.map((partner) => {
                        const isActive = selected?.id === partner.id;
                        return (
                            <button
                                key={partner.id}
                                type="button"
                                onClick={() => handleSelectPartner(partner)}
                                className={`w-full px-4 py-3.5 text-left transition-colors cursor-pointer ${isActive
                                    ? "bg-black text-white"
                                    : "bg-white text-black hover:bg-neutral-50"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-semibold tracking-tight truncate">
                                        {partner.name}
                                    </span>
                                    <span
                                        className={`text-[10px] shrink-0 ${isActive ? "text-neutral-300" : "text-neutral-600"
                                            }`}
                                    >
                                        {partner.city}
                                    </span>
                                </div>
                                <p
                                    className={`mt-1 text-[10px] uppercase tracking-wider ${isActive ? "text-neutral-300" : "text-neutral-600"
                                        }`}
                                >
                                    {partner.hubType}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* Map */}
                <div className="order-1 lg:order-2 relative h-[400px] sm:h-[460px] lg:h-[550px] w-full overflow-hidden bg-[#dce8f4]">
                    {MapComponent && (
                        <MapComponent
                            partners={partners}
                            selected={selected}
                            onSelect={setSelected}
                            zoom={zoom}
                            onZoomChange={(next) => setZoom((prev) => (prev === next ? prev : next))}
                            focusRequestId={focusRequestId}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
