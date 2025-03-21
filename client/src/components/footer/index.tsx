"use client";
import Link from "next/link";
import { ReactSVG } from "react-svg";
import NavLinks from "../NavLinks";

const Footer = ({ theme }: { theme: string }) => {
  return (
    <ul className="fixed transition-all duration-200 ease-in-out bottom-4 right-0 left-[8%] w-10/12 mx-0">
      <NavLinks
        iconSrc="/svgs/theme.svg"
        link="/theme"
        value={theme.split("-")[1]}
      />
    </ul>
  );
};
export default Footer;
