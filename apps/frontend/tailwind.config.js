/** @type {import('tailwindcss').Config} */
const sharedConfig = require("../../packages/tailwind-config/tailwind.config.js")

module.exports = {
  ...sharedConfig,
  content: ["./src/**/*.{js,ts,tsx,jsx}", "./index.html"]
}
