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
        // PRISMA Brand Colors
        prisma: {
          red: "#DC2626",
          "red-hover": "#B91C1C",
          "red-light": "#FEE2E2",
          "red-dark": "#991B1B",
        },
        // Neutral palette
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          800: "#262626",
          900: "#171717",
        },
        // Semantic colors
        primary: "#DC2626",
        "primary-foreground": "#FFFFFF",
        accent: "#DC2626",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
