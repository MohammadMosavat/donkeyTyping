import Link from "next/link";
import { ReactSVG } from "react-svg";

interface FilterLinksProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  filter: string;
  isActive?: boolean;
}

const FilterLinks = (props: FilterLinksProps) => {
  const username = localStorage.getItem("username");
  const { isActive = false, ...rest } = props;

  return (
    username && (
      <Link
        {...rest}
        href={{ pathname: `sort`, query: { filter: props.filter } }}
        className={`text-primary flex items-center transition-all duration-200 ease-in-out gap-2 capitalize font-JetBrainsMono p-2 rounded-xl bg-thrid w-fit  hover:shadow-lg hover:shadow-primary/20 hover:bg-primary/10 ${
          isActive
            ? "border-2 border-primary bg-primary/5 font-medium"
            : "border border-transparent"
        } ${props.className}`}
      >
        <ReactSVG
          src={`/svgs/${props.filter}.svg`}
          className={`[&>div>svg]:size-6 [&_*]:stroke-primary ${
            isActive ? "[&_*]:stroke-[2.5]" : ""
          }`}
        />
        {props.filter}
      </Link>
    )
  );
};

export default FilterLinks;
