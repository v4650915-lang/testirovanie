import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                /* Палитра "Dark Industrial Luxury" */
                graphite: {
                    900: "#0a0a0f",
                    800: "#12121a",
                    700: "#1a1a25",
                    600: "#222230",
                    500: "#2d2d3d",
                },
                gold: {
                    DEFAULT: "#c8a54e",
                    light: "#e8c96a",
                    dark: "#a6852e",
                    dim: "rgba(200, 165, 78, 0.15)",
                },
                steel: {
                    DEFAULT: "#7a8a9e",
                    light: "#9eaec2",
                    dark: "#5a6a7e",
                },
            },
            fontFamily: {
                mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
                display: ['"Orbitron"', '"Rajdhani"', "sans-serif"],
                body: ['"Inter"', '"Roboto"', "sans-serif"],
            },
            backgroundImage: {
                "metal-gradient":
                    "linear-gradient(135deg, #1a1a25 0%, #0a0a0f 50%, #1a1a25 100%)",
                "gold-shine":
                    "linear-gradient(90deg, transparent 0%, rgba(200,165,78,0.3) 50%, transparent 100%)",
                "axis-loader":
                    "linear-gradient(90deg, #c8a54e 0%, #e8c96a 50%, #c8a54e 100%)",
            },
            boxShadow: {
                glow: "0 0 20px rgba(200, 165, 78, 0.3)",
                "glow-strong": "0 0 40px rgba(200, 165, 78, 0.5)",
                steel: "0 0 15px rgba(122, 138, 158, 0.2)",
            },
            animation: {
                "pulse-gold": "pulse-gold 2s ease-in-out infinite",
                "shimmer": "shimmer 3s ease-in-out infinite",
                "axis-move": "axis-move 1.5s ease-in-out infinite",
                "fade-up": "fade-up 0.6s ease-out",
            },
            keyframes: {
                "pulse-gold": {
                    "0%, 100%": { boxShadow: "0 0 10px rgba(200, 165, 78, 0.2)" },
                    "50%": { boxShadow: "0 0 30px rgba(200, 165, 78, 0.6)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                "axis-move": {
                    "0%": { transform: "translateX(-100%)" },
                    "50%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(100%)" },
                },
                "fade-up": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
