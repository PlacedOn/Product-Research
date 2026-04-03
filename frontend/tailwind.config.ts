import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#020617",
        surface: "#0F172A",
        card: "#1E293B",
        borderSoft: "#334155",
        accent: "#6366F1",
        listening: "#22C55E",
        speaking: "#38BDF8",
        textPrimary: "#F8FAFC",
        textSecondary: "#94A3B8",
        danger: "#EF4444",
      },
      boxShadow: {
        glow: "0 0 120px rgba(99,102,241,0.35)",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
