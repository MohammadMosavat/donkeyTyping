"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <>
      <img
        className="fixed top-0 -z-30 w-full h-screen"
        src="/images/bg2.jpg"
        alt=""
      />
      <motion.header
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-10/12 bg-glass my-4 mx-auto flex items-center gap-10 p-2"
      >
        {/* <img src="/svgs/logo.svg" className="w-8 h-8" alt="" /> */}
        <Link href={"/"} className="text-white  text-xl tracking-[-0.2rem]">
          |...
        </Link>
        <Link
          className=" text-white transition-all ease-in-out duration-200 hover:tracking-widest "
          href={"/focus"}
        >
          Focus
        </Link>
      </motion.header>
    </>
  );
};

export default Header;
