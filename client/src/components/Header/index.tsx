"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import NavLinks from "../NavLinks";
import { ReactSVG } from "react-svg";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Header = () => {
  const username = localStorage.getItem("username");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const close = () => {
    setIsOpen(false);
  };
  return (
    <>
      <motion.header
        key={isOpen ? "open" : "closed"}
        initial={{ 
          opacity: 0,
          x: window?.innerWidth >= 768 ? -100 : 0,
          y: window?.innerWidth < 768 ? -100 : 0
        }}
        animate={{ 
          opacity: 1,
          x: 0,
          y: 0
        }}
        transition={{ duration: 0.2 }}
        className={`z-50 md:w-20 bg-thrid w-full flex fixed md:static top-0 left-0 ${
          isOpen ? "h-screen !items-start !flex-col" : "h-fit self-start"
        }  md:flex-col gap-4 items-center p-2 md:p-4 md:rounded-2xl transition-all duration-300`}
      >
        <section className="flex md:hidden  items-center max-md:gap-4 justify-between w-full">
          <button className="left-4 top-4 z-20" onClick={toggleMenu}>
            <ReactSVG
              src="/svgs/menu.svg"
              className="[&>div>svg]:size-7 [&_*]:stroke-primary"
            />
          </button>
          <Link
            onClick={() => close()}
            className="capitalize bg-secondary transition-all duration-200 ease-in-out text-fourth rounded-full w-10 h-10 flex items-center justify-center hover:shadow-lg hover:scale-110 font-JetBrainsMono"
            href={`/${username}/sort?filter=newest`}
          >
            {username?.split("")[0]}
          </Link>
        </section>
        <ul
          className={`md:flex md:flex-col justify-start md:flex-grow gap-4 w-full ${
            isOpen ? "flex flex-col !items-start" : "hidden items-center"
          }`}
        >
          <li className="w-full  md:w-auto">
            <NavLinks
              onClick={() => close()}
              data-tooltip="Home"
              className={`group tooltip w-full md:w-auto ${
                isOpen ? "!rounded-xl" : "!rounded-full"
              } p-2 hover:bg-fourth ${
                pathname === "/" ? "!bg-fourth [&_*]:stroke-2" : ""
              }`}
              iconSrc="/svgs/planet.svg"
              link="/"
              value={
                isOpen && !window.matchMedia("(min-width: 768px)").matches
                  ? "Home"
                  : undefined
              }
            />
          </li>
          <li className="w-full md:w-auto">
            <NavLinks
              onClick={() => close()}
              data-tooltip="Theme"
              className={`group tooltip w-full md:w-auto ${
                isOpen ? "!rounded-xl" : "!rounded-full"
              } p-2 hover:bg-fourth ${
                pathname === "/theme" ? "!bg-fourth [&_*]:stroke-2" : ""
              }`}
              iconSrc="/svgs/theme.svg"
              link="/theme"
              value={
                isOpen && !window.matchMedia("(min-width: 768px)").matches
                  ? "Theme"
                  : undefined
              }
            />
          </li>
        </ul>

        <Link
          className="capitalize max-md:hidden bg-secondary transition-all duration-200 ease-in-out text-fourth rounded-full w-10 h-10 flex items-center justify-center hover:shadow-lg hover:scale-110 font-JetBrainsMono"
          href={`/${username}/sort?filter=newest`}
        >
          {username?.split("")[0]}
        </Link>
      </motion.header>
    </>
  );
};

export default Header;
