"use client";
import Loading from "@/components/loading";
import { WpmRecord } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

const TypeHallFilterPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("sort");
  console.log(query);
  const [records, setRecords] = useState<WpmRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchFilterRecords = async () => {
    setLoading(true);
    if (query == "newest" || query == "oldest") {
      try {
        const response = await axios.get(`http://localhost:5000/store_wpm`);
        if (query == "oldest") {
          setRecords(response.data);
        } else {
          setRecords(response.data.reverse());
        }
      } catch (err) {
        toast.error("Failed to fetch records.");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await axios.get(
          `http://localhost:5000/store_wpm?sort=${query}`
        );
        setRecords(response.data);
      } catch (err) {
        toast.error("Failed to fetch records.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchFilterRecords();
  }, [query]);

  return (
    <>
      {!loading ? (
        <main className="grid grid-cols-2 gap-4 w-full ">
          <div className="overflow-x-auto col-span-full rounded-xl shadow-lg">
            <motion.table
              key={loading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="min-w-full bg-glass text-white rounded-xl "
            >
              {/* Table Header */}
              <thead>
                <tr className="text-left text-white uppercase text-sm tracking-wider">
                  <th className="px-6 py-4 font-JetBrainsMono">Username</th>
                  <th className="px-6 py-4 font-JetBrainsMono">WPM</th>
                  <th className="px-6 py-4 font-JetBrainsMono">
                    Correct Chars
                  </th>
                  <th className="px-6 py-4 font-JetBrainsMono">
                    Incorrect Chars
                  </th>
                  <th className="px-6 py-4 font-JetBrainsMono">Date</th>
                  <th className="px-6 py-4 font-JetBrainsMono">Language</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {records.map((record, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="  hover:bg-white/10 transition-colors"
                  >
                    <td className="px-6 py-4 font-JetBrainsMono">
                      <Link href={`/yourhall/${record.username}`}>
                        <span className="hover:underline-offset-2 hover:underline transition-all ease-in-out duration-200 cursor-pointer ">
                          {record.username || "N/A"}
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-JetBrainsMono">
                      {record.wpm || "—"}
                    </td>
                    <td className="px-6 py-4 font-JetBrainsMono">
                      {record.correct_char || "—"}
                    </td>
                    <td className="px-6 py-4 font-JetBrainsMono">
                      {record.incorrect_char || "—"}
                    </td>
                    <td className="px-6 py-4 font-JetBrainsMono">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-JetBrainsMono">
                      {record.language || "—"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </main>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default TypeHallFilterPage;
