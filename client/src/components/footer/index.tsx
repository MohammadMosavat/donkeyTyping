"use client";
import Link from "next/link";

const Footer = ({ theme }: { theme: string }) => {
  return (
    <Link
      href={"/theme"}
      className="fixed hover:tracking-widest transition-all duration-200 ease-in-out bottom-4 right-0 left-[8%] w-10/12 mx-0"
    >
      <p className="text-primary font-JetBrainsMono ">{theme}</p>
    </Link>
  );
};
export default Footer;
