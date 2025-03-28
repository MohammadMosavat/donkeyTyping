"use client";
import FilterLinks from "@/components/FiltersLink";
import Loading from "@/components/loading";
import WpmRecords from "@/components/WpmRecord";
import { WpmRecord } from "@/types";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  }, [filter]);
  return !loading ? (
    <main className="w-full flex flex-col gap-4 md:gap-6">
      <section className="flex items-center gap-2 ">
        <h1 className="text-lg md:text-xl capitalize font-JetBrainsMono text-primary">
          {filter} WPM Records
        </h1>
      </section>
      <div className="flex items-center gap-4">
        <ul className="flex flex-wrap items-center gap-2 md:gap-3">
          <FilterLinks
            data-tooltip="Base on Date"
            className="tooltip text-sm md:text-base"
            isActive={filter === "newest"}
            filter="newest"
          />
          <FilterLinks
            data-tooltip="Base on Date"
            className="tooltip text-sm md:text-base"
            isActive={filter === "oldest"}
            filter="oldest"
          />
          <FilterLinks
            isActive={filter === "highest"}
            data-tooltip="Base on WPM"
            className="tooltip text-sm md:text-base"
            filter="highest"
          />
          <FilterLinks
            isActive={filter === "lowest"}
            data-tooltip="Base on WPM"
            className="tooltip text-sm md:text-base"
            filter="lowest"
          />
        </ul>
      </div>
      <WpmRecords records={records} />
      {/* <motion.footer
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-4 md:mt-6"
      >
        <Footer />
      </motion.footer> */}
    </main>
  ) : (
    <Loading />
  );
};

export default FilterRecordPage;
