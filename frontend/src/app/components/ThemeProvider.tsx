"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// React 19 dev mode warns on next-themes' inline <script> tag during client renders.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const origError = console.error;
    console.error = (...args: unknown[]) => {
        if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) {
            return;
        }
        origError(...args);
    };
}

export default function ThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
        >
            {children}
        </NextThemesProvider>
    );
}
