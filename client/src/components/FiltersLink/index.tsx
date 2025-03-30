import Link from "next/link";
import { ReactSVG } from "react-svg";
import Button from "../MainButton";

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
      >
        <Button
          variant={isActive ? "outline" : "secondary"}
          size="md"
          icon={`/svgs/${props.filter}.svg`}
          iconPosition="left"
          className={props.className}
        >
          {props.filter}
        </Button>
      </Link>
    )
  );
};

export default FilterLinks;
