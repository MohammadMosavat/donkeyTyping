"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Loading from "../loading";
import { WpmRecord } from "@/types";
import toast from "react-hot-toast";

const WpmRecords = ({ username }: { username: string }) => {
  const [records, setRecords] = useState<WpmRecord[]>([]);
  const [bestOf, setBestOf] = useState<WpmRecord>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const correctCharCounter = useMemo(() => {
    let count = 0;
    records.map((data: WpmRecord) => {
      count += data.correct_char;
    });
    return count;
  }, [records]);

  const incorrectCharCounter = useMemo(() => {
    let count = 0;
    records.map((data: WpmRecord) => {
      count += data.incorrect_char;
    });
    return count;
  }, [records]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/store_wpm?username=${username}`
        );
        setRecords(response.data);

        setError(null); // Clear any previous errors
      } catch (err) {
        console.log("Failed to fetch records.");
      } finally {
        setLoading(false);
      }
    };

    const fetchBestRecordOfUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/store_wpm?username=${username}&sort=highest`
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setBestOf(data[0]);
        } else {
          toast.error(data.message || "Failed to fetch user data.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
    fetchBestRecordOfUserData();
  }, []);

  return (
    <div className=" h-fit">
      {bestOf && (
        <>
          <section className="flex items-center justify-between my-8 gap-4 w-full">
            <h1 className="text-xl font-JetBrainsMono text-white ">
              Best of {username}
            </h1>
            <ul className="flex items-center gap-4">
              <li className="p-2 rounded-xl w-fit mb-8 flex gap-2 items-end bg-glass">
                <p className="text-white text-3xl font-JetBrainsMono ">
                  {correctCharCounter}
                </p>
                <span className="text-white font-JetBrainsMono">
                  Total correct characters
                </span>
              </li>
              <li className="p-2 rounded-xl w-fit mb-8 flex gap-2 items-end bg-glass">
                <p className="text-white text-3xl font-JetBrainsMono ">
                  {incorrectCharCounter}
                </p>
                <span className="text-white font-JetBrainsMono">
                  Total incorrect characters
                </span>
              </li>
            </ul>
          </section>
          <motion.table
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-w-full bg-glass text-white col-span-full rounded-xl"
          >
            {/* Table Header */}
            <thead>
              <tr className="text-left text-white uppercase text-sm tracking-wider">
                <th className="px-6 py-4 font-JetBrainsMono">WPM</th>
                <th className="px-6 py-4 font-JetBrainsMono">Correct Chars</th>
                <th className="px-6 py-4 font-JetBrainsMono">
                  Incorrect Chars
                </th>
                <th className="px-6 py-4 font-JetBrainsMono">Date</th>
                <th className="px-6 py-4 font-JetBrainsMono">Language</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:bg-white/10 transition-colors"
              >
                <td className="px-6 py-4 font-JetBrainsMono">
                  {bestOf.wpm || "—"}
                </td>
                <td className="px-6 py-4 font-JetBrainsMono">
                  {bestOf.correct_char || "—"}
                </td>
                <td className="px-6 py-4 font-JetBrainsMono">
                  {bestOf.incorrect_char || "—"}
                </td>
                <td className="px-6 py-4 font-JetBrainsMono">
                  {new Date(bestOf.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4  font-JetBrainsMono">
                  {bestOf.language || "—"}
                </td>
              </motion.tr>
            </tbody>
          </motion.table>
        </>
      )}
      <h1 className="text-xl font-JetBrainsMono  text-white my-8">
        WPM Records
      </h1>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-500 text-center font-Aspekta">{error}</p>
      ) : records.length === 0 ? (
        <p className="text-white text-center font-Aspekta">No records found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <motion.table
            key={loading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-w-full bg-glass text-white col-span-full rounded-xl"
          >
            {/* Table Header */}
            <thead>
              <tr className="text-left text-white uppercase text-sm tracking-wider">
                <th className="px-6 py-4 font-JetBrainsMono">WPM</th>
                <th className="px-6 py-4 font-JetBrainsMono">Correct Chars</th>
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
                  className="hover:bg-white/10 transition-colors"
                >
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
      )}
    </div>
  );
};

export default WpmRecords;
