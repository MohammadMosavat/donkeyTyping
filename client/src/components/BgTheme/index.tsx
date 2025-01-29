"use client";

const BgTheme = () => {
  const getThemeFromLocal = localStorage.getItem("theme");

  return (
    <img
      className="fixed top-0 left-0 right-0 blur-lg bottom-0 -z-30 scale-110 w-full h-screen"
      src={getThemeFromLocal ?? "/images/bg4.png"}
      alt="Background"
    />
  );
};

export default BgTheme;
