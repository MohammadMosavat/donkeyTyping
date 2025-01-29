"use client";;
import Link from "next/link";
import { motion } from "framer-motion";
import NavLinks from "../NavLinks";
import BgTheme from "../BgTheme";

const Header = () => {
  const username = localStorage.getItem("username");

  return (
    <>
      <BgTheme />
      <motion.header
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-10/12 bg-glass my-4 z-10 fixed left-[8%] mx-auto flex items-center gap-10 p-2"
      >
        <>
          <Link href={"/"}>
            <img
              src="/svgs/logo.svg"
              title="go home"
              className="w-8 h-8"
              alt=""
            />
          </Link>
          <NavLinks link="/quote" value="Quotes" />
          <NavLinks link="/listen-word" value="Listen word" />
          <NavLinks link={`/yourhall/${username}`} value="yourhall" />
          <NavLinks link={`/explore/typehall`} value="Typehall" />
        </>
      </motion.header>
    </>
  );
};

export default Header;
