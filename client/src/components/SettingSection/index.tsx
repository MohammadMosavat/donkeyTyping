"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Loading from "../loading";
import Link from "next/link";

const SettingSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  const getThemeFromLocal = localStorage.getItem("theme");

  const handleImageLoad = (index: number) => {
    setLoading((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
  };
  const imagesArray = [
    { src: "/images/bg3.jpg", alt: "Background Option 1" },
    { src: "/images/bg5.jpg", alt: "Background Option 2" },
    { src: "/images/bg4.png", alt: "Background Option 3" },
    { src: "/images/bg6.jpg", alt: "Background Option 4" },
    { src: "/images/bg7.jpg", alt: "Background Option 5" },
    { src: "/images/bg8.jpg", alt: "Background Option 6" },
    { src: "/images/bg9.jpg", alt: "Background Option 7" },
  ];
  return (
    <>
      <img
        className="fixed top-0 left-0 right-0 blur-lg bottom-0 -z-30 scale-110 w-full h-screen"
        src={getThemeFromLocal ?? "/images/bg4.png"}
        alt="Background"
      />
      <ul className="flex flex-col max-md:w-full gap-4 bg-glass relative p-3 rounded-none">
        <li
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-fit items-center gap-2 cursor-pointer"
        >
          <img src="/svgs/brush.svg" alt="Brush Icon" />
          <p className="text-white font-Aspekta">Theme</p>
        </li>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className=" flex-wrap flex  gap-2 bg-glass p-1.5 rounded-md 
            [&>*]:text-white [&>*]:font-Aspekta "
          >
            {imagesArray.map((image, index) => (
              <div
                className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
                key={index}
              >
                {loading[index] && (
                  <div className="absolute inset-0 flex items-center justify-center  animate-pulse rounded-md">
                    <Loading />
                  </div>
                )}
                <img
                  onLoad={() => handleImageLoad(index)}
                  onClick={() => {
                    setIsOpen(false);
                    localStorage.setItem("theme", image.src);
                  }}
                  className={`w-full h-full object-cover rounded-lg cursor-pointer ${
                    loading[index] ? "hidden" : "block"
                  }`}
                  src={image.src}
                  alt={image.alt}
                />
              </div>
            ))}
          </motion.div>
        )}

        <Link href={"/lyric"} className="text-white font-Aspekta">
          Lyrics
        </Link>
        <Link href={"/quote"} className="text-white font-Aspekta">
          Quotes
        </Link>
        <Link href={"/listen-word"} className="text-white font-Aspekta">
          Listen word
        </Link>
      </ul>
    </>
  );
};

export default SettingSection;
