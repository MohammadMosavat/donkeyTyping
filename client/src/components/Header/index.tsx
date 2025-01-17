"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-10/12 bg-glass my-4 z-10 fixed left-[8%] mx-auto flex items-center gap-10 p-2"
    >
      <Link href={"/"}>
        <img src="/svgs/logo.svg" title="go home" className="w-8 h-8" alt="" />
      </Link>
      <Link
        href={"/lyric"}
        className="text-white hover:tracking-wider transition-all ease-in-out duration-200 font-Aspekta"
      >
        Lyrics
      </Link>
      <Link
        href={"/quote"}
        className="text-white hover:tracking-wider transition-all ease-in-out duration-200 font-Aspekta"
      >
        Quotes
      </Link>
      <Link
        href={"/listen-word"}
        className="text-white hover:tracking-wider transition-all ease-in-out duration-200 font-Aspekta"
      >
        Listen word
      </Link>
      <Link
        href={"/jokes"}
        className="text-white hover:tracking-wider transition-all ease-in-out duration-200 font-Aspekta"
      >
        Jokes
      </Link>
    </motion.header>
  );
};

export default Header;
