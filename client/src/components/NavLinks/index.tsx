import Link from "next/link";
import { ReactSVG } from "react-svg";

const NavLinks = ({
  link,
  value,
  iconSrc,
}: {
  link: string;
  value: string;
  iconSrc: string;
}) => {
  return (
    <Link
      href={`${link}`}
      className="text-primary flex items-center gap-2 capitalize hover:tracking-widest transition-all ease-in-out duration-200 font-JetBrainsMono"
    >
      <ReactSVG
        src={iconSrc}
        className="[&>div>svg]:size-6 [&_*]:stroke-primary"
      />
      {value}
    </Link>
  );
};

export default NavLinks;
