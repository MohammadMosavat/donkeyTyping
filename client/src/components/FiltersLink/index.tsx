import Link from "next/link";
import { ReactSVG } from "react-svg";

interface FilterLinksProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  filter: string;
}

const FilterLinks = (props: FilterLinksProps) => {
  const username = localStorage.getItem("username");
  return (
    username && (
      <Link
        {...props}
        href={{ pathname: `${username}/sort`, query: { filter: props.filter } }}
        className={`text-primary group flex hover:font-bold items-center transition-all duration-200 ease-in-out gap-2 capitalize font-JetBrainsMono p-2 rounded-xl bg-thrid w-fit ${props.className}`}
      >
        <ReactSVG
          src={`/svgs/${props.filter}.svg`}
          className="[&>div>svg]:size-6 group-hover:[&_*]:stroke-2 [&_*]:stroke-primary"
        />
        {props.filter}
      </Link>
    )
  );
};

export default FilterLinks;
