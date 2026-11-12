"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import Map, {
    Marker,
    NavigationControl,
    Popup,
    type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { RotateCcw, X } from "lucide-react";

// Point MapLibre's module worker to /public so Next.js Webpack resolves it cleanly
if (typeof window !== "undefined") {
    maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");
}

export interface Partner {
    id: string;
    name: string;
    city: string;
    lat: number;
    lng: number;
    hubType: string;
}

export const DEFAULT_VIEW = {
    longitude: 32,
    latitude: 22,
    zoom: 1.65,
};

const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";
const CLUSTER_RADIUS_PX = 34;

interface PartnerCluster {
    id: string;
    lng: number;
    lat: number;
    partners: Partner[];
}

function projectToWorldPx(lng: number, lat: number, zoom: number) {
    const scale = 512 * 2 ** zoom;
    const clampedLat = Math.max(-85, Math.min(85, lat));
    const sinLat = Math.sin((clampedLat * Math.PI) / 180);
    return {
        x: ((lng + 180) / 360) * scale,
        y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
    };
}

function clusterPartners(partners: Partner[], zoom: number): PartnerCluster[] {
    if (zoom >= 11) {
        return partners.map((p) => ({ id: p.id, lng: p.lng, lat: p.lat, partners: [p] }));
    }

    const clusters: { x: number; y: number; partners: Partner[] }[] = [];

    for (const partner of partners) {
        const pt = projectToWorldPx(partner.lng, partner.lat, zoom);
        const match = clusters.find((c) => Math.hypot(c.x - pt.x, c.y - pt.y) < CLUSTER_RADIUS_PX);
        if (match) {
            const count = match.partners.length;
            match.x = (match.x * count + pt.x) / (count + 1);
            match.y = (match.y * count + pt.y) / (count + 1);
            match.partners.push(partner);
        } else {
            clusters.push({ x: pt.x, y: pt.y, partners: [partner] });
        }
    }

    return clusters.map((c) => {
        const n = c.partners.length;
        return {
            id: c.partners.map((p) => p.id).join("-"),
            lng: c.partners.reduce((sum, p) => sum + p.lng, 0) / n,
            lat: c.partners.reduce((sum, p) => sum + p.lat, 0) / n,
            partners: c.partners,
        };
    });
}

export interface PartnersMapProps {
    partners: Partner[];
    selected: Partner | null;
    onSelect: (partner: Partner | null) => void;
    zoom: number;
    onZoomChange: (zoom: number) => void;
    focusRequestId: number;
}

export default function PartnersMap({
    partners,
    selected,
    onSelect,
    zoom,
    onZoomChange,
    focusRequestId,
}: PartnersMapProps) {
    const mapRef = useRef<MapRef>(null);
    const styledMapRef = useRef<maplibregl.Map | null>(null);
    const showReset = selected !== null || Math.abs(zoom - DEFAULT_VIEW.zoom) > 0.25;

    useEffect(() => {
        if (!focusRequestId || !selected) return;
        mapRef.current?.flyTo({
            center: [selected.lng, selected.lat],
            zoom: Math.max(zoom, 7.5),
            duration: 1100,
        });
    }, [focusRequestId]); // eslint-disable-line react-hooks/exhaustive-deps

    const focusPartner = (partner: Partner) => {
        onSelect(partner);
        mapRef.current?.flyTo({
            center: [partner.lng, partner.lat],
            zoom: Math.max(zoom, 7.5),
            duration: 1100,
        });
    };

    const focusCluster = (group: Partner[]) => {
        let minLng = Infinity;
        let maxLng = -Infinity;
        let minLat = Infinity;
        let maxLat = -Infinity;

        for (const p of group) {
            if (p.lng < minLng) minLng = p.lng;
            if (p.lng > maxLng) maxLng = p.lng;
            if (p.lat < minLat) minLat = p.lat;
            if (p.lat > maxLat) maxLat = p.lat;
        }

        mapRef.current?.fitBounds(
            [
                [minLng, minLat],
                [maxLng, maxLat],
            ],
            { padding: 90, maxZoom: 10.5, duration: 900 }
        );
    };

    const resetView = () => {
        onSelect(null);
        mapRef.current?.flyTo({
            center: [DEFAULT_VIEW.longitude, DEFAULT_VIEW.latitude],
            zoom: DEFAULT_VIEW.zoom,
            duration: 900,
        });
    };

    const clusters = clusterPartners(partners, zoom);

    return (
        <>
            {showReset && (
                <button
                    type="button"
                    onClick={resetView}
                    className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 bg-black px-3 py-1.5 text-[11px] font-medium text-white shadow-md transition-colors hover:bg-neutral-800 cursor-pointer"
                >
                    <RotateCcw size={12} />
                    Reset View
                </button>
            )}

            <Map
                ref={mapRef}
                mapLib={maplibregl}
                initialViewState={DEFAULT_VIEW}
                minZoom={1.3}
                maxZoom={15}
                cooperativeGestures
                mapStyle={MAP_STYLE}
                style={{ width: "100%", height: "100%" }}
                onMove={(e) => {
                    const nextZoom = Math.round(e.viewState.zoom * 10) / 10;
                    onZoomChange(nextZoom);
                }}
                onStyleData={(e) => {
                    const map = e.target;
                    if (styledMapRef.current === map || !map.getLayer("water")) return;
                    styledMapRef.current = map;
                    if (map.getLayer("background")) {
                        map.setPaintProperty("background", "background-color", "#fafaf8");
                    }
                    // Tint OpenFreeMap positron's heavy grey ocean into a soft enterprise ice-blue
                    map.setPaintProperty("water", "fill-color", "#dce8f4");
                    if (map.getLayer("waterway")) {
                        map.setPaintProperty("waterway", "line-color", "#cfdeed");
                    }
                }}
                onClick={() => onSelect(null)}
            >
                <NavigationControl position="top-right" showCompass={false} />

                {clusters.map((cluster) => {
                    if (cluster.partners.length > 1) {
                        const hasSelected = cluster.partners.some((p) => p.id === selected?.id);
                        return (
                            <Marker
                                key={cluster.id}
                                longitude={cluster.lng}
                                latitude={cluster.lat}
                                anchor="center"
                                style={{ zIndex: hasSelected ? 10 : 2 }}
                                onClick={(e) => {
                                    e.originalEvent.stopPropagation();
                                    focusCluster(cluster.partners);
                                }}
                            >
                                <button
                                    type="button"
                                    aria-label={`Zoom into ${cluster.partners.length} nearby partner hubs`}
                                    className="group relative flex items-center justify-center cursor-pointer outline-none"
                                >
                                    <span className="pointer-events-none absolute bottom-9 left-1/2 -translate-x-1/2 rounded-full bg-neutral-900 px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 scale-95 shadow-md whitespace-nowrap transition-all duration-150 group-hover:opacity-100 group-hover:scale-100">
                                        {cluster.partners.length} hubs nearby
                                    </span>
                                    <span
                                        className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold text-white transition-transform duration-150 group-hover:scale-110 group-focus-visible:scale-110 ${hasSelected
                                            ? "bg-orange-500 shadow-[0_2px_8px_rgba(249,115,22,0.45)] ring-4 ring-orange-500/25"
                                            : "bg-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                                            }`}
                                    >
                                        {cluster.partners.length}
                                    </span>
                                </button>
                            </Marker>
                        );
                    }

                    const partner = cluster.partners[0];
                    const isActive = selected?.id === partner.id;
                    return (
                        <Marker
                            key={partner.id}
                            longitude={partner.lng}
                            latitude={partner.lat}
                            anchor="center"
                            style={{ zIndex: isActive ? 10 : 1 }}
                            onClick={(e) => {
                                e.originalEvent.stopPropagation();
                                focusPartner(partner);
                            }}
                        >
                            <button
                                type="button"
                                aria-label={partner.name}
                                className="group relative flex items-center justify-center cursor-pointer outline-none"
                            >
                                {/* Hover label on inactive pins (avoids overlapping pins and popup title duplication) */}
                                {!isActive && (
                                    <span className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-neutral-900 px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 scale-95 shadow-md whitespace-nowrap transition-all duration-150 group-hover:opacity-100 group-hover:scale-100">
                                        {partner.name}
                                    </span>
                                )}

                                {/* Dark round pin; orange when selected */}
                                <span
                                    aria-hidden="true"
                                    className={`block rounded-full border-2 border-white transition-transform duration-150 ${isActive
                                        ? "h-4 w-4 bg-orange-500 shadow-[0_2px_8px_rgba(249,115,22,0.45)] ring-4 ring-orange-500/25 scale-110"
                                        : "h-3.5 w-3.5 bg-neutral-900 shadow-[0_1px_4px_rgba(0,0,0,0.35)] group-hover:scale-125 group-focus-visible:scale-125"
                                        }`}
                                />
                            </button>
                        </Marker>
                    );
                })}

                {selected && (
                    <Popup
                        longitude={selected.lng}
                        latitude={selected.lat}
                        anchor="top"
                        offset={14}
                        style={{ zIndex: 20 }}
                        closeButton={false}
                        closeOnClick={false}
                        onClose={() => onSelect(null)}
                    >
                        <div className="relative pr-7 text-black">
                            <button
                                type="button"
                                aria-label="Close popup"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelect(null);
                                }}
                                className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-md text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-black cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                            <p className="text-xs font-semibold leading-snug">
                                {selected.name}
                            </p>
                            <p className="text-[11px] text-neutral-600">
                                {selected.city}
                            </p>
                            <p className="mt-1.5 inline-block bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-700">
                                {selected.hubType}
                            </p>
                        </div>
                    </Popup>
                )}
            </Map>
        </>
    );
}
