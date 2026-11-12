import Image from "next/image";
import Link from "next/link";
import { CornerDownRight } from "lucide-react";

export default function CTA() {
    return (
        <section className="relative flex w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[700px] overflow-hidden bg-sky-700 text-white">
            <Image
                src="/images/CTA.jpg"
                alt=""
                fill
                sizes="100vw"
                className="pointer-events-none origin-top-left scale-[1.45] object-cover object-left-top sm:scale-[1.35] lg:scale-100 lg:object-left-top xl:object-center"
            />

            <div className="relative z-10 w-full px-4 py-8 sm:px-8 md:px-10 lg:px-12 lg:py-12">
                <div className="max-w-lg">
                    <span className="mb-5 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-white/90"
                    >
                        <span className="h-1.5 w-1.5 bg-white" />
                        CTA
                    </span>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-medium leading-[1.08] tracking-[-0.03em]">
                        Ready to Take Your
                        <br />
                        Freight Further?
                    </h2>

                    <p className="mt-4 max-w-md text-sm sm:text-base leading-relaxed text-white/90">
                        Let ShipNex move your cargo safely and on time while you focus on taking your business to the next level.
                    </p>

                    <Link
                        href="/signup"
                        className="mt-8 inline-flex items-center gap-2.5 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-neutral-100"
                    >
                        <span className="h-1.5 w-1.5 bg-black" />
                        GET A QUOTE
                        <CornerDownRight size={14} />
                    </Link>
                </div>
            </div>
        </section>
    );
}