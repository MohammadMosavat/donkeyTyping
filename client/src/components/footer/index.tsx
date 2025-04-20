"use client";
import { useSelector } from "react-redux";
import NavLinks from "../NavLinks";
import { RootState } from "@/store";
import FooterItems from "../FooterItems";
import Link from "next/link";

const Footer = () => {
  const theme = useSelector((state: RootState) => state.theme.value);
  const isTyping = useSelector((state: RootState) => state.isTyping.value);

  return (
    isTyping == "off" && (
      <ul className="fixed [&>a>button>p]:inline-block bottom-4 left-4 w-fit px-4">
        <Link href="/theme">
          <FooterItems value={theme} iconSrc="/svgs/theme.svg" />
        </Link>
      </ul>
    )
  );
};
export default Footer;
