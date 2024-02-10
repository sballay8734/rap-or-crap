/** @type {import('tailwindcss').Config} */
const sharedConfig = require("../../packages/tailwind-config/tailwind.config.js")

module.exports = {
  ...sharedConfig,
  content: ["./**/*.{js,ts,jsx,tsx}"]
}
