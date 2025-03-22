import Link from "next/link";

const FilterLinks = ({ filter }: { filter: string }) => {
  const username = localStorage.getItem("username");
  return (
    username && (
      <Link
        href={{ pathname: `${username}/sort`, query: { filter: filter } }}
        className="text-primary capitalize font-JetBrainsMono p-2 rounded-lg bg-thrid w-fit"
      >
        {filter}
      </Link>
    )
  );
};

export default FilterLinks;
