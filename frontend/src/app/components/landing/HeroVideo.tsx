"use client";

import { useEffect, useRef } from "react";

export default function HeroVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let started = false;
        const startVideo = () => {
            if (started) return;
            started = true;
            video.src = "/videos/truck.mp4";
            video.load();
            const playPromise = video.play();
            if (playPromise) {
                playPromise.catch(() => {
                    // Ignore autoplay restrictions
                });
            }
        };

        const timer = setTimeout(startVideo, 6000);
        const onInteract = () => startVideo();
        window.addEventListener("pointerdown", onInteract, { once: true, passive: true });
        window.addEventListener("pointermove", onInteract, { once: true, passive: true });
        window.addEventListener("touchstart", onInteract, { once: true, passive: true });
        window.addEventListener("keydown", onInteract, { once: true, passive: true });
        window.addEventListener("scroll", onInteract, { once: true, passive: true });

        return () => {
            clearTimeout(timer);
            window.removeEventListener("pointerdown", onInteract);
            window.removeEventListener("pointermove", onInteract);
            window.removeEventListener("touchstart", onInteract);
            window.removeEventListener("keydown", onInteract);
            window.removeEventListener("scroll", onInteract);
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
