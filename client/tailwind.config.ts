export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Aspekta: ["Aspekta"],
        JetBrainsMono: ["JetBrainsMono-Regular"],
      },
      fontWeight: {
        light: "400",
        medium: "500",
        semiBold: "600",
        bold: "700",
      },
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        thrid: "var(--thrid)",
        fourth: "var(--fourth)",
      },
    },
  },
  plugins: [],
};
