"use client";
import { useSelector } from "react-redux";
import NavLinks from "../NavLinks";
import { RootState } from "@/store";

const Footer = () => {
  const theme = useSelector((state: RootState) => state.theme.value);

  return (
    <ul className="fixed [&>a>button>p]:inline-block bottom-4 left-4 w-fit max-w-xs px-4">
      <NavLinks
        data-tooltip="Theme"
        className="tooltip hover:bg-thrid font-JetBrainsMono hover:shadow-lg hover:shadow-primary/20 rounded-xl w-full flex justify-center items-center"
        iconSrc="/svgs/theme.svg"
        link="/theme"
        value={theme}
      />
    </ul>
  );
};
export default Footer;
