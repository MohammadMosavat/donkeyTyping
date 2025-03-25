"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import NavLinks from "../NavLinks";
import { ReactSVG } from "react-svg";
const Header = () => {
  const username = localStorage.getItem("username");

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-3/12 mt-4 bg-thrid rounded-xl mx-auto flex justify-between items-center  p-2"
      >
        <Link href={"/"}>
          <ReactSVG
            src="/svgs/planet.svg"
            className="[&>div>svg]:size-7 [&_*]:stroke-primary"
          />
        </Link>
        <ul className="flex items-center justify-center gap-10 ">
          <NavLinks iconSrc="/svgs/home.svg" link="/" value="Home" />
          <NavLinks iconSrc="/svgs/theme.svg" link="/theme" value={`Theme`} />
        </ul>
        <Link
          className="capitalize bg-secondary transition-all duration-200 ease-in-out text-fourth rounded-full px-2.5 py-1 hover:shadow-lg hover:drop-shadow-lg font-JetBrainsMono"
          href={`/${username}/sort?filter=newest`}
        >
          {username?.split("")[0]}
        </Link>
      </motion.header>
    </>
  );
};

export default Header;
