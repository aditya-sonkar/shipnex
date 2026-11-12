"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, Minus, CornerDownRight } from "lucide-react";

interface ServiceItem {
  number: string;
  title: string;
  subtitle: string;
  image: string;
}

const services: ServiceItem[] = [
  {
    number: "01",
    title: "AIR FREIGHT",
    subtitle: "Fast Delivery For Urgent Cargo",
    image: "/images/services/air_freight.jpg",
  },
  {
    number: "02",
    title: "SEA FREIGHT",
    subtitle: "FCL & LCL Shipping Worldwide",
    image: "/images/services/sea_freight.jpg",
  },
  {
    number: "03",
    title: "RAIL FREIGHT",
    subtitle: "Heavy Loads Across Continents",
    image: "/images/services/rail_freight.jpg",
  },
  {
    number: "04",
    title: "ROAD FREIGHT",
    subtitle: "Cross-Border Land Transport",
    image: "/images/services/road_freight.jpg",
  },
  {
    number: "05",
    title: "WAREHOUSING & DISTRIBUTION",
    subtitle: "Secure Storage & Fulfillment",
    image: "/images/services/warehouse.jpg",
  },
  {
    number: "06",
    title: "CUSTOMS CLEARANCE",
    subtitle: "Hassle-Free Import & Export",
    image: "/images/services/customs_clearance.jpg",
  },
  {
    number: "07",
    title: "LAST MILE DELIVERY",
    subtitle: "From Our Facility To Their Door",
    image: "/images/services/LastMileDelivery.jpg",
  },
];

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const accordionContainerRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasMountedRef = useRef(false);

  // 1. Scroll-triggered Reveal Animation (deferred until near viewport)
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    let ctx: gsap.Context | null = null;
    const initReveal = () => {
      if (typeof document !== "undefined" && "fonts" in document && !document.getElementById("inter-slashed-font")) {
        const style = document.createElement("style");
        style.id = "inter-slashed-font";
        style.textContent =
          '@font-face{font-family:"InterSlashed";src:url("/fonts/inter/InterVariable.woff2") format("woff2");font-weight:100 900;font-style:normal;font-display:swap;unicode-range:U+0030-0039;}';
        document.head.appendChild(style);
      }

      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        if (tagRef.current) {
          gsap.fromTo(
            tagRef.current,
            { opacity: 0, x: -15 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: tagRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        const textElements = [headingRef.current, descRef.current].filter(Boolean);
        gsap.fromTo(
          textElements,
          {
            clipPath: "inset(0 100% 0 0)",
            opacity: 0,
            x: -25,
          },
          {
            clipPath: "inset(0 0% 0 0)",
            opacity: 1,
            x: 0,
            duration: 1.1,
            stagger: 0.18,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        const items = accordionContainerRef.current
          ? Array.from(accordionContainerRef.current.children)
          : [];

        items.forEach((item) => {
          gsap.fromTo(
            item,
            {
              y: 50,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }, sectionRef);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          initReveal();
        }
      },
      { rootMargin: "450px 0px" }
    );
    observer.observe(sectionEl);

    return () => {
      observer.disconnect();
      ctx?.revert();
    };
  }, []);

  // 2. Accordion open/collapse animation + dynamic height recalculation
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    contentRefs.current.forEach((content, index) => {
      if (!content) return;

      if (index === activeIndex) {
        gsap.to(content, {
          height: "auto",
          opacity: 1,
          duration: 0.55,
          ease: "power2.inOut",
          overwrite: "auto",
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        });
      } else {
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          overwrite: "auto",
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        });
      }
    });
  }, [activeIndex]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative z-20 bg-[#F9F9FB] px-4 py-8 text-black sm:px-8 md:px-10 lg:px-12 lg:py-12"
    >
      {/* Header */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:mb-14 sm:gap-8 md:grid-cols-2 lg:mb-20">
        <div>
          <span
            ref={tagRef}
            className="mb-4 sm:mb-6 lg:mb-8 flex items-center gap-2 text-xs font-medium tracking-wider text-neutral-500 uppercase"
          >
            <span className="h-1.5 w-1.5 bg-neutral-500" />
            SERVICES
          </span>

          <h2
            ref={headingRef}
            className="max-w-none text-3xl sm:text-4xl md:text-5xl lg:text-[4.2vw] font-semibold leading-[1.05] lg:leading-[0.95] tracking-[-0.04em] will-change-[clip-path,transform]"
          >
            Logistics solutions for your business.
          </h2>
        </div>

        <p
          ref={descRef}
          className="max-w-md text-sm sm:text-base leading-[1.6] text-neutral-700 md:ml-auto md:mt-12 md:self-start lg:mt-16 will-change-[clip-path,transform]"
        >
          From freight transportation to warehousing and delivery,
          we provide everything your business needs to keep
          goods moving.
        </p>
      </div>

      {/* ACCORDION */}
      <div ref={accordionContainerRef} className="space-y-2">
        {services.map((service, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={service.number}
              className={`overflow-hidden transition-colors duration-500 ${isActive
                ? "bg-black text-white"
                : "bg-[#FFFFFF] text-[#333333]"
                }`}
            >
              {/* ACCORDION HEADER */}
              <button
                type="button"
                aria-expanded={isActive}
                aria-controls={`service-panel-${index}`}
                onClick={() =>
                  setActiveIndex(isActive ? -1 : index)
                }
                className={`grid w-full grid-cols-[50px_1fr_24px] items-start gap-4 px-5 text-left md:grid-cols-[90px_1fr_24px] md:px-8 ${isActive ? "pt-6 pb-5 md:pt-7 md:pb-6" : "py-6 md:py-7"}`}
              >
                <span className="font-slashed text-3xl font-light">
                  {service.number}
                </span>

                <div>
                  <h3 className="text-lg font-medium md:text-xl">
                    {service.title}
                  </h3>

                  <p
                    className={`mt-1 text-sm ${isActive
                      ? "text-neutral-400"
                      : "text-neutral-500"
                      }`}
                  >
                    {service.subtitle}
                  </p>
                </div>

                {isActive ? (
                  <Minus size={22} strokeWidth={1.5} />
                ) : (
                  <Plus size={22} strokeWidth={1.5} />
                )}
              </button>

              {/* EXPANDED CONTENT */}
              <div
                id={`service-panel-${index}`}
                ref={(el) => {
                  contentRefs.current[index] = el;
                }}
                aria-hidden={!isActive}
                inert={!isActive}
                style={{
                  height: 0,
                  opacity: 0,
                  overflow: "hidden",
                }}
              >
                {/* Uses the exact same 3-column grid as the header: [number | content | icon] */}
                <div className="grid w-full grid-cols-[50px_1fr_24px] gap-4 px-5 pb-6 text-left md:grid-cols-[90px_1fr_24px] md:px-8 md:pb-8">
                  {/* Col 1: Empty spacer under the number */}
                  <div />

                  {/* Col 2 & 3: Both LEARN MORE and the image are directly below the heading */}
                  <div className="col-span-2 min-w-0 pr-0 md:pr-4">
                    {/* LEARN MORE button: mb-5 md:mb-6 matches the pb-5 md:pb-6 above it */}
                    <div className="mb-5 md:mb-6">
                      <a
                        href="/contact"
                        tabIndex={isActive ? 0 : -1}
                        aria-label={`Learn more about ${service.title}`}
                        className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold text-black tracking-wider uppercase transition-colors hover:bg-neutral-200"
                      >
                        <span className="h-1.5 w-1.5 bg-black" />
                        LEARN MORE
                        <span className="sr-only"> about {service.title}</span>
                        <CornerDownRight size={13} strokeWidth={2} />
                      </a>
                    </div>

                    {/* Image: Aligned with the heading and spans smoothly */}
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[1.85/1] w-full overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 85vw"
                        className="object-cover object-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
