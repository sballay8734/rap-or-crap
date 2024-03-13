/** @type {import('tailwindcss').Config} */
const sharedConfig = require("../../packages/tailwind-config/tailwind.config.js");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "blah-light": "#FF0000",
        "blah-dark": "#8b0000",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
      },
      animation: {
        fadeIn: "fadeIn 200ms ease-in",
        fadeOut: "fadeOut 1s ease-out",
      },
    },
  },
};
