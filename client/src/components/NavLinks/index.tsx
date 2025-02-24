import Link from "next/link";

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
      className="text-white flex items-center gap-2 capitalize hover:tracking-wider transition-all ease-in-out duration-200 font-JetBrainsMono"
    >
      <img className="size-6" src={iconSrc} alt="" />
      {value}
    </Link>
  );
};

export default NavLinks;
