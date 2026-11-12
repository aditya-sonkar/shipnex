"use client";

import { useEffect, useRef } from "react";

export default function HeroVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Force mobile muted autoplay compliance
        video.defaultMuted = true;
        video.muted = true;
        video.playsInline = true;

        const startVideo = () => {
            if (!video.getAttribute("src")) {
                video.src = "/videos/truck.mp4";
            }
            const playPromise = video.play();
            if (playPromise) {
                playPromise.catch(() => {
                    // Autoplay restriction fallback
                });
            }
        };

        // Start video playback seamlessly after initial page load & paint settles
        const scheduleStart = () => {
            if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback(
                    startVideo,
                    { timeout: 1200 }
                );
            } else {
                setTimeout(startVideo, 800);
            }
        };

        if (document.readyState === "complete") {
            scheduleStart();
        } else {
            window.addEventListener("load", scheduleStart, { once: true });
        }

        // Backup for mobile user interaction
        const onInteract = () => {
            startVideo();
        };
        window.addEventListener("touchstart", onInteract, { once: true, passive: true });
        window.addEventListener("pointerdown", onInteract, { once: true, passive: true });

        return () => {
            window.removeEventListener("load", scheduleStart);
            window.removeEventListener("touchstart", onInteract);
            window.removeEventListener("pointerdown", onInteract);
        };
    }, []);

    return (
        <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="none"
            width={1920}
            height={1080}
            title="Shipnex Logistics Truck Video"
            aria-hidden="true"
            className="absolute inset-0 z-[1] h-full w-full object-cover scale-[1.01] bg-transparent"
        />
    );
}
