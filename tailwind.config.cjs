module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /.*/, // 🔥 KEEP ALL CLASSES (debug mode)
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}