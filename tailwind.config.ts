import type { Config } from "tailwindcss";

// Palette pulled from the handoff doc and the nso.xaml taskbar theme.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nso: {
          ink: "#4d21cb", // ButtonForeground
          purple: "#7b59d2", // ButtonShadow
          face: "#edd8ef", // ButtonFace
          light: "#fcf1fc", // ButtonLight
          paper: "#fdf6fd",
          pink: "#ff77a8",
          blush: "#f5e6fa",
          lav: "#cfa8f5",
          lav2: "#dcb8f8",
          cyan: "#70e6ff",
          mint: "#93ecdf",
          sky: "#5db3e0",
          blue: "#1500ff",
          night: "#12081f",
          plum: "#42255e",
          hot: "#f096dc",
          // Darker text versions of sky and hot, readable on the light window backgrounds
          sea: "#1f6fa5",
          rose: "#b8338f",
        },
      },
      fontFamily: {
        pixel: ["var(--font-pixel)", "monospace"],
        dot: ["var(--font-dot)", "monospace"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
