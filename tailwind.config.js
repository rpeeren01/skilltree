/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#FFD700",
        goldDark: "#C9A227",
        neon: "#00F0FF",
        neonGreen: "#39FF14",
        neonPurple: "#B14EFF",
        danger: "#FF3B3B",
        bg: {
          DEFAULT: "#0A0A0F",
          card: "#13131D",
          cardHover: "#1A1A28",
          border: "#262636",
        },
      },
      fontFamily: {
        display: ["Outfit", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(0,240,255,0.35)",
        glowGold: "0 0 24px rgba(255,215,0,0.45)",
        card: "0 4px 24px rgba(0,0,0,0.4)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 12px rgba(255,215,0,0.4)" },
          "50%": { boxShadow: "0 0 28px rgba(255,215,0,0.8)" },
        },
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        coinPop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        shimmer: "shimmer 2.2s linear infinite",
        pulseGlow: "pulseGlow 1.8s ease-in-out infinite",
        floatUp: "floatUp 0.3s ease-out",
        coinPop: "coinPop 0.4s ease-out",
        gradientShift: "gradientShift 12s ease infinite",
      },
    },
  },
  plugins: [],
};
