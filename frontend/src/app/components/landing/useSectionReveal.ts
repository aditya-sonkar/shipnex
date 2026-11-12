"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type SectionRevealRefs = {
    sectionRef: RefObject<HTMLElement | null>;
    tagRef: RefObject<HTMLSpanElement | null>;
    headingRef: RefObject<HTMLHeadingElement | null>;
    descRef: RefObject<HTMLParagraphElement | null>;
    itemsRef: RefObject<HTMLDivElement | null>;
};

/** Applies the shared Features-style ScrollTrigger entrance (tag -> clipPath text wipe -> staggered items). */
export function useSectionReveal({ sectionRef, tagRef, headingRef, descRef, itemsRef }: SectionRevealRefs) {
    useEffect(() => {
        const sectionEl = sectionRef.current;
        if (!sectionEl) return;

        let ctx: gsap.Context | null = null;
        let rafId = 0;

        const initReveal = () => {
            gsap.registerPlugin(ScrollTrigger);
            rafId = requestAnimationFrame(() => {
                ctx = gsap.context(() => {
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: sectionEl,
                            start: "top 75%",
                            once: true,
                        },
                    });

                    if (tagRef.current) {
                        tl.fromTo(
                            tagRef.current,
                            { opacity: 0, x: -15 },
                            { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
                        );
                    }

                    const textElements = [headingRef.current, descRef.current].filter(Boolean);
                    if (textElements.length > 0) {
                        tl.fromTo(
                            textElements,
                            { clipPath: "inset(0 100% 0 0)", opacity: 0, x: -25 },
                            {
                                clipPath: "inset(0 0% 0 0)",
                                opacity: 1,
                                x: 0,
                                duration: 1.1,
                                stagger: 0.18,
                                ease: "power3.out",
                            },
                            "-=0.3"
                        );
                    }

                    const items = itemsRef.current
                        ? Array.from(itemsRef.current.children).sort(
                            (a, b) => (Number(getComputedStyle(a).order) || 0) - (Number(getComputedStyle(b).order) || 0)
                        )
                        : [];
                    if (items.length > 0) {
                        tl.fromTo(
                            items,
                            { y: 70, opacity: 0, willChange: "transform, opacity" },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 0.85,
                                stagger: 0.1,
                                ease: "power2.out",
                                force3D: true,
                                clearProps: "transform,willChange",
                            },
                            "-=0.6"
                        );
                    }
                }, sectionRef);
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    observer.disconnect();
                    initReveal();
                }
            },
            { rootMargin: "350px 0px" }
        );
        observer.observe(sectionEl);

        return () => {
            observer.disconnect();
            cancelAnimationFrame(rafId);
            ctx?.revert();
        };
    }, [sectionRef, tagRef, headingRef, descRef, itemsRef]);
}

