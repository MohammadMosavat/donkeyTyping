import Link from "next/link";
import { ReactSVG } from "react-svg";

interface NavLinksProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  link: string;
  value?: string;
  iconSrc: string;
  className?: string;
}

const NavLinks: React.FC<NavLinksProps> = ({
  link,
  value,
  iconSrc,
  className,
  ...rest
}) => {
  return (
    <Link
      href={link}
      className={`${className} group text-primary w-fit flex items-center gap-2 capitalize hover:font-bold transition-all ease-in-out duration-200 font-JetBrainsMono `}
      {...rest}
    >
      <ReactSVG
        src={iconSrc}
        className="[&>div>svg]:size-7 group-hover:[&_*]:stroke-2 [&_*]:stroke-primary"
      />
      {value && <p className="md:h h-fit">{value}</p>}
    </Link>
  );
};

export default NavLinks;
