import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F4F4EF",
        foreground: "#0A0A0A",
        muted: "#6B6B6B",
        accent: {
          DEFAULT: "#6366F1",
          foreground: "#FFFFFF",
        },
        inverted: {
          DEFAULT: "#0A0A0A",
          foreground: "#FAFAFA",
          muted: "#A0A0A0",
        },
        border: {
          DEFAULT: "#E5E5E0",
          inverted: "#1F1F1F",
        },
      },
      fontFamily: {
        sans: ["Satoshi", "sans-serif"],
        display: ["Satoshi", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        handwriting: ["Caveat", "cursive"],
      },
      fontSize: {
        "display-sm": ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(3rem, 7vw, 5.5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(4rem, 9vw, 7.5rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
      },
      animation: {
        marquee: "marquee 60s linear infinite",
        "marquee-reverse": "marquee-reverse 70s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;