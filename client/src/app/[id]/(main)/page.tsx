"use client";
import FilterLinks from "@/components/FiltersLink";
import Loading from "@/components/loading";
import WpmRecords from "@/components/WpmRecord";
import { WpmRecord } from "@/types";
import axios from "axios";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MainPageProfile = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [records, setRecords] = useState<WpmRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const currentFilter = searchParams.get("filter") || "newest";

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/store_wpm?username=${params.id}`
        );
        setRecords(response.data);
        setError(null);
      } catch (err) {
        console.log("Failed to fetch records.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [params.id, currentFilter]);

  return !loading ? (
    <main className="w-full flex flex-col gap-6">
      <h1 className="text-xl font-JetBrainsMono text-primary my-8">
        WPM Records
      </h1>
      <ul className="flex items-center gap-2">
        <FilterLinks isActive={currentFilter === "newest"} filter="newest" />
        <FilterLinks isActive={currentFilter === "oldest"} filter="oldest" />
        <FilterLinks
          isActive={currentFilter === "highest"}
          data-tooltip="Base on WPM"
          className="tooltip"
          filter="highest"
        />
        <FilterLinks
          isActive={currentFilter === "lowest"}
          data-tooltip="Base on WPM"
          className="tooltip"
          filter="lowest"
        />
      </ul>
      <WpmRecords records={records} />
    </main>
  ) : (
    <Loading />
  );
};

export default MainPageProfile;
