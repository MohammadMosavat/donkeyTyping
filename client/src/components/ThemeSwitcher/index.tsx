"use client";
import themes from "@/data/theme";
import { useEffect, useState } from "react";
import Footer from "../footer";
import { motion } from "framer-motion";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ?? "theme-indigo-emerald"
  ); // Default theme

  useEffect(() => {
    document.title = 'PlanetType | Themes';
    document.documentElement.className =
      localStorage.getItem("theme") ?? "theme-indigo-emerald";
  });

  const changeTheme = (themeName: string) => {
    localStorage.setItem("theme", themeName);
    document.documentElement.className = themeName; // Apply theme to <html>
    setTheme(themeName);
  };

  return (
    <div className="md:w-full mx-auto min-h-screen w-full  text-secondary">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {themes.map((t) => {
          return (
            <button
              key={t.name}
              onClick={() => {
                changeTheme(t.class);
              }}
              className={`${
                theme == t.class && "bg-thrid"
              } hover:bg-thrid !bg-opacity-50 cursor-pointer hover:font-bold transition-all duration-200 ease-in-out text-primary w-full flex items-center gap-2 sm:gap-0 justify-between p-2 rounded-xl`}
            >
              <p className="font-JetBrainsMono text-primary text-sm md:text-base">
                {t.name}
              </p>
              <section className="flex bg-glass p-1.5 md:p-2 items-center rounded-full gap-1.5 md:gap-2">
                <p
                  title={t.colors.primary}
                  style={{
                    backgroundColor: t.colors.primary,
                    color: t.colors.primary,
                  }}
                  className="px-2 md:px-2.5 rounded-full"
                >
                  .
                </p>
                <p
                  title={t.colors.secondary}
                  style={{
                    backgroundColor: t.colors.secondary,
                    color: t.colors.secondary,
                  }}
                  className="px-2 md:px-2.5 rounded-full"
                >
                  .
                </p>
                <p
                  title={t.colors.third}
                  style={{
                    backgroundColor: t.colors.third,
                    color: t.colors.third,
                  }}
                  className="px-2 md:px-2.5 rounded-full"
                >
                  .
                </p>
                <p
                  title={t.colors.fourth}
                  style={{
                    backgroundColor: t.colors.fourth,
                    color: t.colors.fourth,
                  }}
                  className="px-2 md:px-2.5 rounded-full"
                >
                  .
                </p>
              </section>
            </button>
          );
        })}
      </ul>
      {/* <motion.footer
        key={theme}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4 md:mt-0"
      >
        <Footer />
      </motion.footer> */}
    </div>
  );
}
