"use client";
import Link from "next/link";
import { ReactSVG } from "react-svg";
import NavLinks from "../NavLinks";

const Footer = () => {
  const removeThemePrefix = (theme: string): string => {
    return theme.replace(/^theme-/, "");
  };

  return (
    <ul className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
      <NavLinks
        data-tooltip="Theme"
        className="tooltip hover:bg-thrid text-sm font-JetBrainsMono hover:shadow-lg hover:shadow-primary/20 rounded-xl p-2 w-full flex justify-center items-center"
        iconSrc="/svgs/theme.svg"
        link="/theme"
        value={removeThemePrefix(localStorage.getItem("theme") ?? "")}
      />
    </ul>
  );
};
export default Footer;
