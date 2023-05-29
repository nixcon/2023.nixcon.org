/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        nixblue: {
          DEFAULT: "#6586C8",
          50: "#ECF0F8",
          100: "#DDE4F3",
          200: "#BFCDE8",
          300: "#A1B5DD",
          400: "#839ED3",
          500: "#6586C8",
          600: "#4067B4",
          700: "#324F8B",
          800: "#233862",
          900: "#142038",
          950: "#0D1424",
        },
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        behrensschrift: ["Behrensschrift", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
