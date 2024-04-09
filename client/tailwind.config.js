/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/pages/**/*.{js,ts,jsx.tsx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    fontFamily: {
      display: ["Luckiest Guy"],
      startGame: ["Pixelify Sans"],
      main: ["Poppins"]
    },
    extend: {
      colors: {
        primary: "#BB86FC",
        primaryLighter: "#d5b3ff",
        primaryDarker: "#453659",
        primaryVariant: "#3700B3",
        primaryInactive: "#1f132b",
        secondary: "#03DAC6",
        secondaryDarker: "#007368",
        secondaryInactive: "#001a17",
        surface: "#121212",
        lightGray: "#e0e0e0",
        surfaceLighter: "#4d4d4d",
        surfaceLightest: "#1e1e1e",
        background: "#121212",
        error: "#cf6679",
        errorText: "#f44336",
        overlay: "#383838",
        faded: "#ababab",
        heroP: "#b088cf",
        warning: "#ffd24a",
        warningDark: "#664d00",
        test: "#121212",

        onPrimary: "#000000",
        onSecondary: "#000000",
        onBackground: "#FFFFFF",
        onSurface: "#FFFFFF",
        onError: "#000000",
        success: "#66bb6a"
      },
      keyframes: {
        skeleton: {
          "0%, 100%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" }
        },
        notes: {
          "0%": { transform: "scale(1) translate(0, 0)", opacity: 0 },
          "25%": {
            transform: "scale(1.2) translate(25%, -25%)",
            opacity: 0.25
          },
          "50%": {
            transform: "scale(1.4) translate(50%, -50%)",
            opacity: 0.5
          },
          "75%": {
            transform: "scale(1.6) translate(75%, -75%)",
            opacity: 0.75
          },
          "100%": {
            transform: "scale(1.8) translate(100%, -100%)",
            opacity: 0
          }
        }
      },
      animation: {
        skeleton: "skeleton 1.5s infinite",
        music: "notes 1.5s infinite linear"
      },
      boxShadow: {
        secondary: "0 1px 5px rgba(0, 115, 104, 0.05)",
        primary: "0 3px 8px rgba(69, 54, 89, 0.24)",
        main: "0 3px 8px rgba(0, 0, 0, 0.24)"
      }
    }
  },
  plugins: []
}

// box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
