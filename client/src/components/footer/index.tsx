"use client";
import Link from "next/link";
import { ReactSVG } from "react-svg";
import NavLinks from "../NavLinks";

const Footer = () => {
  const removeThemePrefix = (theme: string): string => {
    return theme.replace(/^theme-/, "");
  };

  return (
    <ul className="fixed transition-all duration-200 ease-in-out bottom-4 right-0 left-[8%] w-10/12 mx-0">
      <NavLinks
        data-tooltip="Theme"
        className="tooltip hover:bg-thrid hover:shadow-lg hover:shadow-primary/20 rounded-xl p-2" 
        iconSrc="/svgs/theme.svg"
        link="/theme"
        value={removeThemePrefix(localStorage.getItem("theme") ?? "")}
      />
    </ul>
  );
};
export default Footer;
