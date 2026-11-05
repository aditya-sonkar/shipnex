"use client";

import { useState } from "react";

export default function Impact() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setSubscribed(true);
        setTimeout(() => {
            alert(`Thank you for subscribing to ShipNex newsletter with ${email}!`);
            setEmail("");
            setSubscribed(false);
        }, 800);
    };

    return (
        <section
            id="purpose"
            className="relative w-full min-h-[480px] sm:min-h-[540px] lg:min-h-[600px] flex items-center select-none overflow-hidden"
        >
            {/* Aerial cargo ship hero image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/cargoship_img.webp"
                    alt="Aerial Cargo Ship"
                    className="w-full h-full object-cover object-center"
                />
            </div>

            {/* Newsletter section */}
            <div className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 sm:px-12 lg:px-20 py-20 sm:py-28 lg:py-32">
                <div className="max-w-3xl">
                    <h2 className="font-gangster font-extrabold text-3xl sm:text-4xl lg:text-[52px] leading-[1.08] tracking-[-0.03em] text-white drop-shadow-md">
                        Our Strategic Advantage?
                    </h2>

                    <p className="mt-4 text-sm sm:text-base lg:text-[17px] font-outfit text-white leading-relaxed max-w-2xl font-normal drop-shadow-sm">
                        Redefining logistics through innovation, insight, and unparalleled commitment
                    </p>

                    <form onSubmit={handleSubscribe} className="mt-8 sm:mt-10 max-w-md">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full bg-white text-zinc-900 rounded-md px-5 py-3.5 sm:py-4 text-sm sm:text-base font-outfit shadow-xl focus:outline-none focus:ring-2 focus:ring-[#353A95]"
                        />

                        <button
                            type="submit"
                            disabled={subscribed}
                            className="mt-4 inline-flex items-center justify-center gap-2 px-8 sm:px-9 py-3.5 sm:py-4 rounded-md bg-[#353A95] hover:bg-[#4349ab] active:scale-[0.98] text-white font-outfit font-bold text-sm sm:text-base tracking-wide transition-all shadow-xl hover:shadow-2xl cursor-pointer disabled:opacity-75"
                        >
                            <span>{subscribed ? "Subscribed!" : "Subscribe to Newsletter"}</span>
                            <span className="font-bold tracking-tighter text-sm sm:text-base">&gt;&gt;</span>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
