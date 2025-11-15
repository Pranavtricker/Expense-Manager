/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        accent: "#22d3ee",
        success: "#16a34a",
        warning: "#f59e0b",
        danger: "#ef4444",
        muted: "#9CA3AF",
        bg: "#0b1220",
        surface: "#0f172a",
        card: "#111827"
      }
    }
  },
  plugins: []
};