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
        className="w-10/12  z-20 bg-sec rounded-xl fixed left-[8%] mx-auto flex justify-between items-center gap-10 py-4 p-2"
      >
        <Link href={"/"}>
        <ReactSVG src="/svgs/logo.svg" className="[&>div>svg]:size-8 [&_*]:fill-primary" />
        </Link>
        <ul className="flex items-center justify-center gap-10 ">
          <NavLinks iconSrc="/svgs/home.svg" link="/" value="Home" />
          <NavLinks iconSrc="/svgs/theme.svg" link="/theme" value={`Theme`} />
          {/* <NavLinks iconSrc="/svgs/quote.svg" link="/quote" value="Quotes" />
          <NavLinks
            iconSrc="/svgs/headphones.svg"
            link="/listen-word"
            value="Listen word"
          /> */}
          {/* <NavLinks
            iconSrc="/svgs/cup.svg"
            link={`/explore/typehall`}
            value="Typehall"
          /> */}
        </ul>
        <Link
          className="capitalize transition-all duration-200 ease-in-out text-primary bg-thrid rounded-full px-2.5 py-1 hover:shadow-xl hover:drop-shadow-xl font-JetBrainsMono"
          href={`/yourhall/${username}`}
        >
          {username?.split("")[0]}
        </Link>
      </motion.header>
    </>
  );
};

export default Header;
