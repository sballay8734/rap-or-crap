/** @type {import('tailwindcss').Config} */
const sharedConfig = require("../../packages/tailwind-config/tailwind.config.js");

module.exports = {
  ...sharedConfig,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../ui/**/*.{js,ts,jsx,tsx}",
  ],
};
