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
      className="text-primary flex items-center gap-2 capitalize hover:tracking-[0.3em] transition-all ease-in-out duration-200 font-JetBrainsMono"
    >
      <ReactSVG
        src={iconSrc}
        className="[&>div>svg]:size-6 [&_*]:stroke-primary"
      />
      <p>{value}</p>
    </Link>
  );
};

export default NavLinks;
