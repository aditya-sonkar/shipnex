"use client";

import { useRef } from "react";
import Image from "next/image";
import { useSectionReveal } from "./useSectionReveal";



interface ServiceItem {
    id: string;
    icon: string;
    title: string;
    description: string;
}

const services: ServiceItem[] = [
    {
        id: "01",
        icon: "/images/svg/money.svg",
        title: "COST SAVINGS",
        description:
            "Optimized routes and negotiated carrier rates, so you spend less on every shipment.",
    },
    {
        id: "02",
        icon: "/images/svg/vehicle_time.svg",
        title: "ON-TIME GUARANTEED",
        description:
            "Your cargo arrives on time, every time. 98.2% delivery rate across 150+ countries.",
    },
    {
        id: "03",
        icon: "/images/svg/call_support.svg",
        title: "24/7 SUPPORT",
        description:
            "A real person is always available to handle your queries and urgent concerns at any hour.",
    },
    {
        id: "04",
        icon: "/images/svg/paperwork.svg",
        title: "HASSLEFREE PAPERWORK",
        description:
            "Every document handled digitally by our team no forms, no errors, no back-and-forth.",
    },
];


export default function WhyShipnex() {
    const sectionRef = useRef<HTMLElement>(null);
    const tagRef = useRef<HTMLSpanElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useSectionReveal({ sectionRef, tagRef, headingRef, descRef, itemsRef: gridRef });

    return (
        <section
            id="why-us"
            ref={sectionRef}
            className="bg-[#F9F9FB] px-4 py-8 text-black sm:px-8 md:px-10 lg:px-12 lg:py-12"
        >
            {/* Header */}
            <div className="mb-10 grid grid-cols-1 gap-6 sm:mb-14 sm:gap-8 md:grid-cols-2 lg:mb-20">
                <div>
                    <span
                        ref={tagRef}
                        className="mb-4 sm:mb-6 lg:mb-8 flex items-center gap-2 text-xs font-medium tracking-wider text-neutral-500 uppercase"
                    >
                        <span className="h-1.5 w-1.5 bg-neutral-500" />
                        WHY CHOOSE US
                    </span>

                    <h2
                        ref={headingRef}
                        className="max-w-none text-3xl sm:text-4xl md:text-5xl lg:text-[4.2vw] font-semibold leading-[1.05] lg:leading-[0.95] tracking-[-0.04em] will-change-[clip-path,transform]"
                    >
                        What makes shipnex different?
                    </h2>
                </div>

                <p
                    ref={descRef}
                    className="max-w-md text-sm sm:text-base leading-[1.6] text-neutral-700 md:ml-auto md:mt-12 md:self-start lg:mt-16 will-change-[clip-path,transform]"
                >
                    Unlock operational efficiency, reduce logistics costs, and gain better control over every shipment with smarter technology and seamless transportation solutions.
                </p>
            </div>

            <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-[1fr_0.7fr_0.3fr_0.7fr_1fr]">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className={`group flex flex-col justify-between border border-neutral-200 bg-white p-3.5 sm:p-5 lg:p-6 transition-colors hover:bg-neutral-50/50 aspect-square lg:aspect-[5/4] ${service.id === "01"
                            ? "order-2 lg:order-1 col-span-1 lg:col-span-1"
                            : service.id === "02"
                                ? "order-3 lg:order-2 col-span-1 lg:col-span-2"
                                : service.id === "03"
                                    ? "order-5 lg:order-5 col-span-1 lg:col-span-2"
                                    :
                                    "order-6 lg:order-6 col-span-1 lg:col-span-1"
                            }`}
                    >
                        <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center bg-neutral-100">
                            <img
                                src={service.icon}
                                alt=""
                                className="h-4 w-4 object-contain"
                            />
                        </div>
                        <div className="mt-2">
                            <h3 className="mb-1 sm:mb-2 text-xs sm:text-base lg:text-lg xl:text-xl font-semibold uppercase tracking-[-0.02em] leading-snug">
                                {service.title}
                            </h3>

                            <p className="text-[11px] sm:text-sm leading-relaxed text-black/70 max-w-sm line-clamp-3 sm:line-clamp-4 lg:line-clamp-none">
                                {service.description}
                            </p>
                        </div>
                    </div>
                ))}
                <div className="relative aspect-square sm:aspect-[2/1] lg:aspect-auto lg:h-full overflow-hidden order-1 lg:order-3 col-span-2 lg:col-span-2">
                    <Image
                        src="/images/deliveryman.jpg"
                        alt="Cargo Delivery"
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                    />
                </div>

                <div className="relative aspect-square sm:aspect-[2/1] lg:aspect-auto lg:h-full overflow-hidden order-4 lg:order-4 col-span-2 lg:col-span-2">
                    <Image
                        src="/images/railfreight.jpg"
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                    />
                </div>
            </div>
        </section>
    )
}
