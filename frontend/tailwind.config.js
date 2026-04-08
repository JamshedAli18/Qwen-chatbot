import typography from '@tailwindcss/typography';

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'DM Mono'", "monospace"],
        serif: ["'Fraunces'", "serif"],
      },
      colors: {
        base: "#0e0e0e",
        surface: "#161616",
        raised: "#1e1e1e",
        border: "#2a2a2a",
        muted: "#555",
        subtle: "#888",
        primary: "#e8e2d9",
        accent: "#c9a96e",     // warm gold
        "accent-dim": "#7a5c2e",
      },
    },
  },
  plugins: [typography],
};