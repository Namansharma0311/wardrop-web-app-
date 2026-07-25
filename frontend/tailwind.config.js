/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF7F1",
        ink: "#21201D",
        moss: "#4B5C3F",
        mossdark: "#36402F",
        clay: "#A8623F",
        line: "#DEDACE",
      },
      fontFamily: {
        display: ["'Big Shoulders'", "sans-serif"],
        body: ["'Work Sans'", "sans-serif"],
      },
      borderRadius: {
        tag: "4px",
      },
    },
  },
  plugins: [],
};
