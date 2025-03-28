import Link from "next/link";
import { ReactSVG } from "react-svg";
import Button from "../MainButton";

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
    <Link href={link} {...rest}>
      <Button
        variant="ghost"
        size="md"
        icon={iconSrc}
        iconPosition="left"
        className={`${className} !justify-start !p-2 md:aspect-square rounded-full [&>svg]:size-8 [&>div>svg]:size-8`}
      >
        <p className="inline-block md:hidden">{value}</p>
      </Button>
    </Link>
  );
};

export default NavLinks;
