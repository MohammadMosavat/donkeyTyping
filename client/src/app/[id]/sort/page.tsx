"use client";
import WpmRecords from "@/components/WpmRecord";
import { WpmRecord } from "@/types";
import axios from "axios";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReactSVG } from "react-svg";

const FilterRecordPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const [records, setRecords] = useState<WpmRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/store_wpm?username=${params.id}&sort=${
            filter == "lowest" ? "highest" : filter
          }`
        );
        console.log(response.data);
        if (filter == "oldest" || filter == "highest") {
          console.log("reverse");
          setRecords(response.data.reverse());
        } else {
          console.log("not reverse");
          setRecords(response.data);
        }

        setError(null); // Clear any previous errors
      } catch (err) {
        console.log("Failed to fetch records.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);
  return (
    <main className="w-full flex flex-col gap-6">
      <section className="flex items-center gap-4">
        <Link href={`/${params.id}`}>
          <ReactSVG
            src="/svgs/arrow-left.svg"
            className="[&>div>svg]:size-6 [&_*]:stroke-primary"
          />
        </Link>
        <h1 className="text-xl capitalize font-JetBrainsMono  text-primary my-8">
          {filter} WPM Records
        </h1>
      </section>
      <ul className="flex items-center gap-2">
        {/* <Link
          href={{ pathname: `${params.id}/sort`, query: { filter: "highest" } }}
          className="text-primary font-JetBrainsMono p-2 rounded-lg bg-thrid w-fit"
        >
          Highest
        </Link>
        <Link
          href={`${params.id}/sort/newest`}
          className="text-primary font-JetBrainsMono p-2 rounded-lg bg-thrid w-fit"
        >
          Newest
        </Link> */}
      </ul>
      <WpmRecords records={records} />
    </main>
  );
};

export default FilterRecordPage;
