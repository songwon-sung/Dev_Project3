/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        base: "16px",
      },
      colors: {
        main: "#3FFF62",
        black01: "#000000",
        black02: "#1E1E1E",
        gray01: "#A0A0A0",
        gray02: "#444444",
        main_80: "#3FFF6280",
      },
      fontFamily: {
        pretendard: ["Pretendard"], //기본 폰트
      },
    },
  },
  plugins: [],
};
