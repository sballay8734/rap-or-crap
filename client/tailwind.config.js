/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/pages/**/*.{js,ts,jsx.tsx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#BB86FC",
        primaryVariant: "#3700B3",
        primaryInactive: "#1f132b",
        secondary: "#03DAC6",
        secondaryInactive: "#001a17",
        surface: "#121212",
        surfaceLigher: "#4d4d4d",
        background: "#121212",
        error: "#CF6679",
        overlay: "#383838",
        faded: "#ababab",
        test: "#121212",

        onPrimary: "#000000",
        onSecondary: "#000000",
        onBackground: "#FFFFFF",
        onSurface: "#FFFFFF",
        onError: "#000000",
        success: "#51cf66",
        error: "#ff6a6a"
      },
      keyframes: {
        skeleton: {
          "0%, 100%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" }
        }
      },
      animation: {
        skeleton: "skeleton 1.5s infinite"
      }
    }
  },
  plugins: []
}
