const config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-poppins)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        purple: {
          50: "#E8EEFD",
          100: "#D0DEFB",
          200: "#A2BCF6",
          300: "#739BF2",
          400: "#447AEE",
          500: "#1659E9",
          600: "#1147BB",
          700: "#0D358C",
          800: "#09235D",
          900: "#04122F",
          950: "#030C21",
        },
        background: "var(--background)",
        backgroundSecondary: "var(--background-secondary)",
        foreground: "var(--foreground)",
        primary: "var(--text-primary)",
        textPrimary: "var(--text-primary)",
        textLoop: "var(--text-loop)",
        hoverPrimary: "var(--hover-primary)",
        borderPrimary: "var(--border-primary)",
        border: "var(--border)",
      },
    },
  },
  plugins: [],
};

export default config;
