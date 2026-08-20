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
        "bg-deep": "#05050a",
        "bg-surface": "#0d0d14",
        "bg-elevated": "#14141f",
        "bg-hover": "#1a1a2e",
        border: "#1e1e2e",
        "border-glow": "#2a2a4a",
        "border-active": "#667eea",
        "accent-primary": "#667eea",
        "accent-purple": "#764ba2",
        "accent-hot": "#ff6464",
        "accent-success": "#38ef7d",
        "accent-gold": "#f7e479",
        "accent-pink": "#ff69b4",
        "text-primary": "#f0f0f0",
        "text-secondary": "#888899",
        "text-muted": "#555566",
      },
      fontFamily: {
        display: ["Clash Display", "sans-serif"],
        body: ["Satoshi", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-input": "linear-gradient(90deg, #FF6464, #FFBF59, #47C9FF)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;