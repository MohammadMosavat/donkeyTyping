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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const close = () => {
    setIsOpen(false);
  };

  const userProfile = useMemo(() => {
    return (
      user.length > 0 && (
        <Link
          onClick={() => close()}
          className="capitalize bg-secondary transition-all duration-200 ease-in-out text-fourth rounded-full w-10 h-10 flex items-center justify-center hover:shadow-lg hover:scale-110 font-JetBrainsMono"
          href={`/${user[0].username}/sort?filter=newest`}
        >
          {user[0].username?.split("")[0]}
        </Link>
      )
    );
  }, [user]);
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
          <section className="flex md:hidden  items-center max-md:gap-4 justify-between w-full">
            <button className="left-4 top-4 z-20" onClick={toggleMenu}>
              <ReactSVG
                src="/svgs/menu.svg"
                className="[&>div>svg]:size-7 [&_*]:stroke-primary"
              />
            </button>
            {userProfile}
          </section>
          <ul
            className={`md:flex justify-start gap-8 ${
              isOpen ? "flex flex-col !items-start" : "hidden items-center"
            }`}
          >
            <li className="w-full  md:w-auto">
              <NavLinks
                onClick={() => close()}
                className={`group [&>a>button]:!p-0 w-full md:w-auto ${isOpen &&
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
          </ul>

          {user.length > 0 ? (
            <Link
              className={`capitalize max-md:hidden bg-secondary transition-all duration-200 ease-in-out text-fourth rounded-xl w-8 h-8 flex items-center justify-center hover:shadow-lg hover:scale-110 font-JetBrainsMono  ${
                pathname === `/${user[0].username}/sort`
                  ? "!bg-fourth text-primary [&_*]:stroke-2"
                  : ""
              }`}
              href={`/${user[0].username}/sort?filter=newest`}
            >
              {user[0].username?.split("")[0]}
            </Link>
          ) : (
            <NavLinks
              onClick={() => close()}
              className={`group w-full md:w-auto ${isOpen &&
                "!rounded-xl"} p-2 [&>button>p]:hidden hover:bg-fourth ${
                pathname === "/register/signup" ||
                pathname === "/register/login"
                  ? "!bg-fourth [&_*]:stroke-2"
                  : ""
              }`}
              iconSrc="/svgs/user.svg"
              link="/register/signup"
              value={"Sign up"}
            />
          )}
        </motion.header>
      </>
    )
  );
};

export default Header;
