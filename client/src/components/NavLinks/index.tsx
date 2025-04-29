import Link from "next/link";
import { ReactSVG } from "react-svg";
import Button from "../MainButton";

interface NavLinksProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  link: string;
  value?: string;
  iconSrc?: string;
  className?: string;
  tooltip?: string;
}

const NavLinks: React.FC<NavLinksProps> = ({
  link,
  value,
  iconSrc,
  className,
  tooltip,
  ...rest
}) => {
  return (
    <Link href={link} {...rest}>
      <Button
        variant="ghost"
        data-tooltip={tooltip}
        size="md"
        icon={iconSrc}
        iconPosition="left"
        className={`${className} ${tooltip && 'tooltip'}  !justify-start rounded-full`}
      >
        <p className="inline-block capitalize">{value}</p>
      </Button>
    </Link>
  );
};

export default NavLinks;
