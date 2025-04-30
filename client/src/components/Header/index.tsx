"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import NavLinks from "../NavLinks";
import { ReactSVG } from "react-svg";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import Button from "../MainButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import useUser from "@/hooks/useUser";

const Header = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isTyping = useSelector((state: RootState) => state.isTyping.value);

  const close = () => {
    setIsOpen(false);
  };

  const yourHallLink = useMemo(() => {
    const username = user[0]?.username
    return user.length > 0 ? (
      <NavLinks
        onClick={() => close()}
        className={`group [&>a>button]:!p-0 w-full md:w-auto ${isOpen &&
          "!rounded-xl"} opacity-50 hover:opacity-100 bg-transparent ${
          pathname === `/${username}/sort`
            ? "!opacity-100 [&_*]:stroke-2"
            : ""
        }`}
        link={`/${username}/sort?filter=newest`}
        value={"Yourhall"}
      />
    ) : (
      <NavLinks
        onClick={() => close()}
        className={`group [&>a>button]:!p-0 w-full md:w-auto ${isOpen &&
          "!rounded-xl"} opacity-50 hover:opacity-100 bg-transparent ${
          pathname === `/register/signup` ? "!opacity-100 [&_*]:stroke-2" : ""
        }`}
        link={`/register/signup`}
        value={"Signup"}
      />
    );
  }, [user , pathname]);

  return (
    isTyping == "off" && (
      <>
        <motion.header
          key={isOpen ? "open" : "closed"}
          initial={{
            opacity: 0,
            x: window?.innerWidth >= 768 ? -100 : 0,
            y: window?.innerWidth < 768 ? -100 : 0,
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
          }}
          transition={{ duration: 0.2 }}
          className={`z-50 w-full flex fixed md:static top-0 left-0 ${
            isOpen ? "h-screen !items-start !flex-col" : "h-fit self-start"
          } gap-4 items-center  justify-between md:rounded-2xl transition-all duration-300`}
        >
          <ul
            className={`md:flex justify-start gap-8 ${
              isOpen ? "flex flex-col !items-start" : "hidden items-center"
            }`}
          >
            <li className="w-full  md:w-auto">
              <NavLinks
                onClick={() => close()}
                className={`group [&>button]:!p-0 w-full md:w-auto ${isOpen &&
                  "!rounded-xl"} opacity-50 hover:opacity-100 bg-transparent ${
                  pathname === "/" ? "!opacity-100 [&_*]:stroke-2" : ""
                }`}
                link="/"
                value={"Home"}
              />
            </li>
            <li className="w-full md:w-auto">
              <NavLinks
                onClick={() => close()}
                className={`group [&>a>button]:!p-0 w-full md:w-auto ${isOpen &&
                  "!rounded-xl"} opacity-50 hover:opacity-100 bg-transparent ${
                  pathname === "/theme" ? "!opacity-100 [&_*]:stroke-2" : ""
                }`}
                link="/theme"
                value={"Theme"}
              />
            </li>
            <li className="w-full md:w-auto">
              <NavLinks
                onClick={() => close()}
                className={`group [&>a>button]:!p-0 w-full md:w-auto ${isOpen &&
                  "!rounded-xl"} opacity-50 hover:opacity-100 bg-transparent ${
                  pathname === "/settings" ? "!opacity-100 [&_*]:stroke-2" : ""
                }`}
                link="/settings"
                value={"Settings"}
              />
            </li>
            <li className="w-full md:w-auto">{yourHallLink}</li>
          </ul>
        </motion.header>
      </>
    )
  );
};

export default Header;
