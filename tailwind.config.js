module.exports = {
  content: ["./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: "#000",
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/line-clamp")],
};
