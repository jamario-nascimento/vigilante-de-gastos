// Removed TypeScript-only 'type' import because this is a .js file; using JSDoc for type hints instead.
import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens principais
        primary: "#137fec",
        backgroundLight: "#f6f7f8",
        backgroundDark: "#101922",
        success: "#28A745",
        danger: "#DC3545",
        warning: "#FFC107",
        // Paleta auxiliar existente
        brand: colors.violet,
        colorscheme: {
          light: {
            background: colors.gray[50],
            surface: colors.white,
            primary: colors.indigo[600],
            secondary: colors.gray[400],
            accent: colors.violet[500],
            text: colors.gray[900],
          },
          dark: {
            background: colors.gray[900],
            surface: colors.gray[800],
            primary: colors.indigo[400],
            secondary: colors.gray[500],
            accent: colors.violet[300],
            text: colors.gray[100],
          }
        },
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
        alt: ["Roboto", "sans-serif"],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontWeight: {
        regular: "400",
        medium: "500",
        bold: "700",
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio")
  ],
};

export default config;
