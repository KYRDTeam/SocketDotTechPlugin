/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined)
      return `rgba(var(${variableName}), ${opacityValue})`;
    else return `rgb(var(${variableName}))`;
  };
}
const pickColors = {
  primary: {
    100: "#b9f5df",
    200: "#1de9b6",
    300: "#00e2a4",
    400: "#00e2a4",
    450: "#292D2C",
    500: "#00da93",
    600: "#09c986",
    700: "#06b476",
    800: "#00a368",
    850: "#16463A",
    900: "#05814f",
  },
  white: {
    200: "#A9AEAD",
    300: "#F3F8F7",
    900: "#fff",
  },
  gray: {
    200: "#949695",
    250: "#121212",
    350: "#3A3E3C",
    400: "#7f8483",
    450: "#4b4f4e",
    500: "#3b3e3c",
    550: "#1B1D1C",
    600: "#292d2c",
    650: "#181818",
    700: "#1b1d1c",
    800: "#0f0f0f",
    900: "#010101",
  },
  whiteAlpha: {
    50: "rgba(255, 255, 255, 0.04)",
    100: "rgba(255, 255, 255, 0.06)",
    200: "rgba(255, 255, 255, 0.08)",
    300: "rgba(255, 255, 255, 0.16)",
    400: "rgba(255, 255, 255, 0.24)",
    500: "rgba(255, 255, 255, 0.36)",
    600: "rgba(255, 255, 255, 0.48)",
    700: "rgba(255, 255, 255, 0.64)",
    800: "rgba(255, 255, 255, 0.80)",
    900: "rgba(255, 255, 255, 0.92)",
  },
  blackAlpha: {
    400: "rgba(0, 0, 0, 0.4)",
  },
};
module.exports = {
  enabled: process.env.NODE_ENV === "publish",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        "2xl": "1366px",
        // => @media (min-width: 1366px) { ... }

        "3xl": "1920px",
        // => @media (min-width: 1920px) { ... }
      },
      textColor: {
        widget: {
          accent: "#1de9b6",
          onAccent: withOpacity("--socket-widget-on-accent-color"),
          primary: withOpacity("--socket-widget-primary-text-color"),
          "primary-main": withOpacity("--socket-widget-primary-color"),
          secondary: withOpacity("--socket-widget-secondary-text-color"),
          outline: withOpacity("--socket-widget-outline-color"),
          "on-interactive": withOpacity("--socket-widget-on-interactive"),
        },
        ...pickColors,
      },
      backgroundColor: {
        widget: {
          accent: "#1de9b6",
          onAccent: withOpacity("--socket-widget-on-accent-color"),
          primary: withOpacity("--socket-widget-primary-color"),
          secondary: withOpacity("--socket-widget-secondary-color"),
          outline: withOpacity("--socket-widget-outline-color"),
          interactive: withOpacity("--socket-widget-interactive"),
          "secondary-text": withOpacity("--socket-widget-secondary-text-color"),
        },
        ...pickColors,
      },
      borderColor: {
        widget: {
          accent: withOpacity("--socket-widget-accent-color"),
          primary: withOpacity("--socket-widget-primary-color"),
          secondary: withOpacity("--socket-widget-secondary-color"),
          "secondary-text": withOpacity("--socket-widget-secondary-text-color"),
          outline: withOpacity("--socket-widget-outline-color"),
        },
        ...pickColors,
      },
      width: {
        5.5: "1.375rem",
        6.5: "1.625rem",
        35: "35px",
        300: "300px",
        "28px": "28px",
        "38px": "38px",
      },
      height: {
        5.5: "1.375rem",
        6.5: "1.625rem",
        35: "35px",
        "48px": "48px",
        300: "300px",
        "28px": "28px",
        "38px": "38px",
        "500px": "500px",
        "700px": "700px",
      },
      fontSize: {
        "15px": "15px",
      },
      borderRadius: {
        "14px": "14px",
      },
      padding: {
        "9px": "9px",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
