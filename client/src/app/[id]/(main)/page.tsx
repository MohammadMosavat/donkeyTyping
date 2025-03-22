"use client";
import FilterLinks from "@/components/FiltersLink";
import WpmRecords from "@/components/WpmRecord";
import { WpmRecord } from "@/types";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const MainPageProfile = () => {
  const params = useParams();
  const [records, setRecords] = useState<WpmRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/store_wpm?username=${params.id}`
        );
        setRecords(response.data);

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
      <h1 className="text-xl font-JetBrainsMono  text-primary my-8">
        WPM Records
      </h1>
      <ul className="flex items-center gap-2">
        <FilterLinks filter={"newest"} />
        <FilterLinks filter={"oldest"} />
        <FilterLinks filter={"highest"} />
        <FilterLinks filter={"lowest"} />
      </ul>
      <WpmRecords records={records} />;
    </main>
  );
};

export default MainPageProfile;
