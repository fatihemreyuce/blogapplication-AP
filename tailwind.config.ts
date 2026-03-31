import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      /* ── Border radius ─────────────────────────────── */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      /* ── Colors ────────────────────────────────────── */
      colors: {
        // Shadcn/UI semantic tokens (unchanged)
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input:  "hsl(var(--input))",
        ring:   "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        // Dark palette
        dark: {
          "08": "hsl(var(--dark-08))",
          "10": "hsl(var(--dark-10))",
          "15": "hsl(var(--dark-15))",
          "20": "hsl(var(--dark-20))",
          "25": "hsl(var(--dark-25))",
          "30": "hsl(var(--dark-30))",
          "35": "hsl(var(--dark-35))",
          "40": "hsl(var(--dark-40))",
        },

        // Grey shades
        grey: {
          "50": "hsl(var(--grey-50))",
          "60": "hsl(var(--grey-60))",
          "70": "hsl(var(--grey-70))",
          "80": "hsl(var(--grey-80))",
          "90": "hsl(var(--grey-90))",
          "95": "hsl(var(--grey-95))",
          "97": "hsl(var(--grey-97))",
          "99": "hsl(var(--grey-99))",
        },

        // ── Brand palette · Green · Blue · Purple ──────
        // Uses CSS vars so opacity modifiers (e.g. bg-brand-green/20) work.
        brand: {
          green: {
            DEFAULT: "hsl(var(--brand-green) / <alpha-value>)",
            light:   "hsl(var(--brand-green-light) / <alpha-value>)",
            dark:    "hsl(var(--brand-green-dark) / <alpha-value>)",
          },
          blue: {
            DEFAULT: "hsl(var(--brand-blue) / <alpha-value>)",
            light:   "hsl(var(--brand-blue-light) / <alpha-value>)",
            dark:    "hsl(var(--brand-blue-dark) / <alpha-value>)",
          },
          purple: {
            DEFAULT: "hsl(var(--brand-purple) / <alpha-value>)",
            light:   "hsl(var(--brand-purple-light) / <alpha-value>)",
            dark:    "hsl(var(--brand-purple-dark) / <alpha-value>)",
          },
        },
      },

      /* ── Background images / gradients ─────────────── */
      backgroundImage: {
        // Full brand gradient (green → blue → purple)
        "brand-gradient":   "linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)",
        // Reversed
        "brand-gradient-r": "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #10b981 100%)",
        // Horizontal
        "brand-gradient-h": "linear-gradient(90deg,  #10b981 0%, #3b82f6 50%, #8b5cf6 100%)",
        // Two-color pairs
        "green-blue":        "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
        "blue-purple":       "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        "green-purple":      "linear-gradient(135deg, #10b981 0%, #8b5cf6 100%)",
        // Radial
        "brand-radial":      "radial-gradient(ellipse at center, #3b82f6, #8b5cf6, #10b981)",
        // Soft overlay variants (for active nav bg etc.)
        "brand-soft":
          "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(59,130,246,0.15) 50%, rgba(139,92,246,0.15) 100%)",
      },

      /* ── Box shadows ────────────────────────────────── */
      boxShadow: {
        "brand":         "0 4px 24px rgba(59,130,246,0.35)",
        "brand-green":   "0 4px 24px rgba(16,185,129,0.35)",
        "brand-purple":  "0 4px 24px rgba(139,92,246,0.35)",
        "brand-lg":      "0 8px 40px rgba(59,130,246,0.40)",
        "inner-glow":    "inset 0 0 24px rgba(59,130,246,0.10)",
        "glow-green":    "0 0 32px rgba(16,185,129,0.45)",
        "glow-blue":     "0 0 32px rgba(59,130,246,0.45)",
        "glow-purple":   "0 0 32px rgba(139,92,246,0.45)",
      },

      /* ── Keyframes ──────────────────────────────────── */
      keyframes: {
        // Floating orb
        "orb-float": {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%":      { transform: "translateY(-40px) scale(1.08)" },
        },
        // Shimmer sweep (moves backgroundPosition)
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition:  "200% center" },
        },
        // Card entrance
        "card-in": {
          from: {
            opacity: "0",
            transform: "perspective(1200px) translateY(32px) scale(0.97)",
          },
          to: {
            opacity: "1",
            transform: "perspective(1200px) translateY(0) scale(1)",
          },
        },
        // Opacity pulse (borders, glows)
        "border-pulse": {
          "0%, 100%": { opacity: "0.5" },
          "50%":      { opacity: "1"   },
        },
        // Box-shadow glow oscillation
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(16,185,129,0.25)" },
          "50%":      { boxShadow: "0 0 40px rgba(139,92,246,0.50)" },
        },
        // Slide in from left
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to:   { opacity: "1", transform: "translateX(0)"      },
        },
        // Gradient background-position loop
        "gradient-shift": {
          "0%":   { backgroundPosition: "0% 50%"   },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%"   },
        },
        // Simple fade in
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        // Scale + fade in
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.93)" },
          to:   { opacity: "1", transform: "scale(1)"    },
        },
        // Subtle bounce
        "bounce-sm": {
          "0%, 100%": { transform: "translateY(0)"    },
          "50%":      { transform: "translateY(-4px)" },
        },
      },

      /* ── Animation utilities ────────────────────────── */
      animation: {
        "orb-float":      "orb-float 8s ease-in-out infinite",
        shimmer:          "shimmer 3s linear infinite",
        "card-in":        "card-in 0.7s cubic-bezier(0.23, 1, 0.32, 1) both",
        "border-pulse":   "border-pulse 3s ease-in-out infinite",
        "glow-pulse":     "glow-pulse 3s ease-in-out infinite",
        "slide-in-left":  "slide-in-left 0.4s cubic-bezier(0.23, 1, 0.32, 1) both",
        "gradient-shift": "gradient-shift 4s ease infinite",
        "fade-in":        "fade-in 0.3s ease-in-out both",
        "scale-in":       "scale-in 0.3s cubic-bezier(0.23, 1, 0.32, 1) both",
        "bounce-sm":      "bounce-sm 2s ease-in-out infinite",
      },
    },
  },

  plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;
