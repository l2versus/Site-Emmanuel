import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // ─── Paleta Premium "Dark Rosé" ────────────────────────────────
      colors: {
        brand: {
          50: "#fdf2f4",
          100: "#fce7eb",
          200: "#f9d0d9",
          300: "#f4a9b9",
          400: "#ed7694",
          500: "#e14a72",
          600: "#cd2a5b",
          700: "#ac1e4a",
          800: "#901c42",
          900: "#7b1b3d",
          950: "#440a1e",
        },
        gold: {
          50: "#fdfaed",
          100: "#f9f0cb",
          200: "#f3e093",
          300: "#edcb5b",
          400: "#e8b835",
          500: "#d99c22",
          600: "#c07a1a",
          700: "#9f5919",
          800: "#83471b",
          900: "#6c3b1a",
          950: "#3e1e0a",
        },
        dark: {
          50: "#f6f6f7",
          100: "#e2e3e5",
          200: "#c4c6cb",
          300: "#9fa2a9",
          400: "#7b7e87",
          500: "#60636d",
          600: "#4c4e56",
          700: "#3e3f47",
          800: "#2a2b30",
          900: "#1a1b1f",
          950: "#0d0d0f",
        },
      },

      // ─── Tipografia Responsiva com clamp() ──────────────────────────
      fontSize: {
        "display-xl": [
          "clamp(2.5rem, 5vw + 1rem, 5rem)",
          { lineHeight: "1.1", fontWeight: "800", letterSpacing: "-0.02em" },
        ],
        "display-lg": [
          "clamp(2rem, 4vw + 0.5rem, 3.75rem)",
          { lineHeight: "1.15", fontWeight: "700", letterSpacing: "-0.01em" },
        ],
        "display-md": [
          "clamp(1.5rem, 3vw + 0.5rem, 2.5rem)",
          { lineHeight: "1.2", fontWeight: "600" },
        ],
        "body-lg": [
          "clamp(1.05rem, 1vw + 0.5rem, 1.25rem)",
          { lineHeight: "1.7" },
        ],
      },

      // ─── Fontes Customizadas ────────────────────────────────────────
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },

      // ─── Animações Premium ──────────────────────────────────────────
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-right": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulse_glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(225, 74, 114, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(225, 74, 114, 0.6)" },
        },
        crossfade: {
          "0%, 40%": { opacity: "1" },
          "50%, 90%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "counter-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "marquee-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "blur-in": {
          "0%": { filter: "blur(12px)", opacity: "0" },
          "100%": { filter: "blur(0)", opacity: "1" },
        },
        "rotate-in": {
          "0%": { transform: "rotate(-10deg) scale(0.9)", opacity: "0" },
          "100%": { transform: "rotate(0) scale(1)", opacity: "1" },
        },
        "stagger-fade": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "parallax-slow": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-30px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-right": "fade-in-right 0.6s ease-out forwards",
        "fade-in-left": "fade-in-left 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slide-down 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        shimmer: "shimmer 2s infinite linear",
        float: "float 3s ease-in-out infinite",
        pulse_glow: "pulse_glow 2s ease-in-out infinite",
        crossfade: "crossfade 12s ease-in-out infinite",
        "counter-up": "counter-up 0.8s ease-out forwards",
        "marquee-left": "marquee-left 30s linear infinite",
        "blur-in": "blur-in 0.8s ease-out forwards",
        "rotate-in": "rotate-in 0.6s ease-out forwards",
        "stagger-fade": "stagger-fade 0.5s ease-out forwards",
        "parallax-slow": "parallax-slow 1s ease-out forwards",
      },

      // ─── Sombras Premium ────────────────────────────────────────────
      boxShadow: {
        glow: "0 0 30px rgba(225, 74, 114, 0.15)",
        "glow-lg": "0 0 60px rgba(225, 74, 114, 0.25)",
        premium:
          "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(225, 74, 114, 0.05)",
        glass:
          "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.05)",
      },

      // ─── Backdrop Blur ──────────────────────────────────────────────
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },

      // ─── Breakpoints customizados ───────────────────────────────────
      screens: {
        xs: "475px",
        "3xl": "1920px",
      },

      // ─── Transições ─────────────────────────────────────────────────
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [typography],
};

export default config;
