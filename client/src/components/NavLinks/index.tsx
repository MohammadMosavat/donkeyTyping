import Link from "next/link";

const NavLinks = ({ link, value }: { link: string; value: string }) => {
  return (
    <Link
      href={`${link}`}
      className="text-white capitalize hover:tracking-wider transition-all ease-in-out duration-200 font-Aspekta"
    >
      {value}
    </Link>
  );
};

export default NavLinks;
