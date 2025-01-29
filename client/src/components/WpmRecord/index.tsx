"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Loading from "../loading";
import { WpmRecord } from "@/types";

const WpmRecords = ({ username }: { username: string } ) => {
  const [records, setRecords] = useState<WpmRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
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

    fetchRecords();
  }, []);

  return (
    <div className="p-6 sm:p-8 h-fit">
      <h1 className="text-3xl font-Aspekta font-bold text-white text-center mb-8">
        WPM Records
      </h1>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-500 text-center font-Aspekta">{error}</p>
      ) : records.length === 0 ? (
        <p className="text-white text-center font-Aspekta">No records found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((record, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-glass col-span-full p-6 flex items-center justify-between rounded-lg shadow-md transform transition-all hover:scale-105"
            >
              <p className="text-white font-Aspekta ">
                <span>WPM:</span> {record.wpm}
              </p>
              <p className="text-white font-Aspekta">
                <span>Correct Chars:</span> {record.correct_char}
              </p>
              <p className="text-white font-Aspekta">
                <span>Incorrect Chars:</span> {record.incorrect_char}
              </p>
              <p className="text-white font-Aspekta">
                <span>Date:</span> {new Date(record.date).toLocaleDateString()}
              </p>
              <p className="text-white font-Aspekta">
                <span>Language:</span> {record.language}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WpmRecords;
