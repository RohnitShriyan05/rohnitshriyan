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
        background: "#050505",
        foreground: "#ededed",
        surface: "#0a0a0a",
        "surface-light": "#111111",
        chrome: "#c0c0c0",
        "chrome-light": "#e8e8e8",
        "chrome-dark": "#888888",
        "system-red": "#FF3333",
        "system-red-dark": "#cc2929",
        muted: "#666666",
      },
      fontFamily: {
        sans: ["var(--font-clash)", "var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
        display: ["var(--font-clash)", "var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display": ["clamp(4rem, 12vw, 14rem)", { lineHeight: "0.85", letterSpacing: "-0.04em" }],
        "heading": ["clamp(2.5rem, 6vw, 6rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "subheading": ["clamp(1rem, 2vw, 1.25rem)", { lineHeight: "1.5" }],
      },
      animation: {
        "pulse-red": "pulse-red 2s ease-in-out infinite",
        "float": "float 8s ease-in-out infinite",
        "typewriter": "typewriter 2s steps(20) forwards",
        "blink": "blink 1s step-end infinite",
      },
      keyframes: {
        "pulse-red": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotateY(0deg)" },
          "50%": { transform: "translateY(-30px) rotateY(180deg)" },
        },
        typewriter: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "chrome-gradient": "linear-gradient(135deg, #888888 0%, #e8e8e8 25%, #888888 50%, #e8e8e8 75%, #888888 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
