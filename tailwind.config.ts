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
        // Bid for bid farvepalette
        cream: {
          50:  "#FDFAF6",
          100: "#F7F3EE",
          200: "#EDE6DB",
          300: "#DDD3C3",
        },
        earth: {
          900: "#2C2416",
          800: "#3D3120",
          700: "#56452C",
          600: "#7A6347",
        },
        spice: {
          // Brændt orange – accent
          DEFAULT: "#C96A2E",
          light: "#E08548",
          dark: "#A5531F",
        },
        sage: {
          // Skovgrøn – sekundær
          DEFAULT: "#5C8A6A",
          light: "#7EAA8C",
          dark: "#3F6B50",
        },
      },
      fontFamily: {
        serif: ["var(--font-lora)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-sm": ["2.5rem", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      typography: (theme: (arg: string) => string) => ({
        bfb: {
          css: {
            "--tw-prose-body": theme("colors.earth.900"),
            "--tw-prose-headings": theme("colors.earth.900"),
            "--tw-prose-links": theme("colors.spice.DEFAULT"),
            "--tw-prose-bold": theme("colors.earth.900"),
            "--tw-prose-counters": theme("colors.earth.600"),
            "--tw-prose-bullets": theme("colors.earth.600"),
            "--tw-prose-hr": theme("colors.cream.200"),
            "--tw-prose-quotes": theme("colors.earth.800"),
            "--tw-prose-quote-borders": theme("colors.spice.DEFAULT"),
            "--tw-prose-code": theme("colors.earth.800"),
            "--tw-prose-pre-bg": theme("colors.cream.200"),
            maxWidth: "none",
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
