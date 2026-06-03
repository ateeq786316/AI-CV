/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', "system-ui", "sans-serif"],
        display: ['"Fraunces"', "Georgia", "serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#0f1419",
          muted: "#5c6570",
          faint: "#8b939e",
        },
        surface: {
          DEFAULT: "#f4f5f7",
          raised: "#ffffff",
          sunken: "#e8eaed",
        },
        accent: {
          DEFAULT: "#0d6e63",
          hover: "#0a5a51",
          light: "#e6f4f2",
          ring: "#5eead4",
        },
        sidebar: {
          DEFAULT: "#111827",
          hover: "#1f2937",
          border: "#374151",
          text: "#9ca3af",
          active: "#ffffff",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 20, 25, 0.04), 0 4px 16px rgba(15, 20, 25, 0.06)",
        cardHover: "0 4px 24px rgba(15, 20, 25, 0.1)",
        inset: "inset 0 1px 2px rgba(15, 20, 25, 0.06)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      animation: {
        "fade-in": "fadeIn 0.35s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
