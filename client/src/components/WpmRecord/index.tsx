"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Loading from "../loading";
import { WpmRecord } from "@/types";
import toast from "react-hot-toast";
import LineChart from "../Charts";
import PaginatedItems from "../PaginationItems";

const WpmRecords = ({ records }: { records: WpmRecord[] }) => {
  const [bestOf, setBestOf] = useState<WpmRecord>();

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

  const RecordChart = useMemo(() => {
    const lastFive = Array.isArray(records) && records?.slice(-5);
    console.log("lastFive", lastFive);
    const LastFiveRecordFilter = (label: string): number[] => {
      if (Array.isArray(lastFive)) {
        if (label == "wpm") return lastFive.map((rec: WpmRecord) => rec.wpm);
        if (label == "inChar")
          return lastFive.map((rec: WpmRecord) => rec.incorrect_char);
        if (label == "corChar")
          return lastFive.map((rec: WpmRecord) => rec.correct_char);
      }
      return [];
    };

    const datasets = [
      {
        label: "WPM",
        data: LastFiveRecordFilter("wpm"),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Correct Characters",
        data: LastFiveRecordFilter("inChar"),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
      {
        label: "Incorrect Characters",
        data: LastFiveRecordFilter("corChar"),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ];
    const labels = ["R5", "R4", "R3", "R2", "R1"];
    const title = "Last 5 Record";
    return (
      <div className="flex flex-col gap-4">
        <LineChart labels={labels} datasets={datasets} title={title} />
        <p className="font-JetBrainsMono text-sm text-center text-primary">
          R1 : Record Number 1
        </p>
      </div>
    );
  }, []);

  return (
    <div className=" w-full h-fit">
      {/* {bestOf && (
        <>
          <section className="flex items-center justify-between my-8 gap-4 w-full">
            <h1 className="text-xl font-JetBrainsMono text-primary ">
              Best of {username}
            </h1>
            <ul className="flex items-center gap-4">
              <li className="p-2 rounded-xl w-fit mb-8 flex gap-2 items-end">
                <p className="text-primary text-3xl font-JetBrainsMono ">
                  {correctCharCounter}
                </p>
                <span className="text-primary font-JetBrainsMono">
                  Total correct characters
                </span>
              </li>
              <li className="p-2 rounded-xl w-fit mb-8 flex gap-2 items-end">
                <p className="text-primary text-3xl font-JetBrainsMono ">
                  {incorrectCharCounter}
                </p>
                <span className="text-primary font-JetBrainsMono">
                  Total incorrect characters
                </span>
              </li>
            </ul>
          </section>
          <motion.table
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-w-full overflow-hidden text-primary col-span-full rounded-xl"
          >
            <thead>
              <tr className="text-left text-primary uppercase text-sm tracking-wider">
                <th className="px-6 py-4 font-JetBrainsMono">WPM</th>
                <th className="px-6 py-4 font-JetBrainsMono">Correct Chars</th>
                <th className="px-6 py-4 font-JetBrainsMono">
                  Incorrect Chars
                </th>
                <th className="px-6 py-4 font-JetBrainsMono">Date</th>
                <th className="px-6 py-4 font-JetBrainsMono">Time</th>
                <th className="px-6 py-4 font-JetBrainsMono">Language</th>
              </tr>
            </thead>

            <tbody>
              <motion.tr
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:bg-thrid rounded-xl transition-colors"
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
                  {new Date(bestOf.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 font-JetBrainsMono">
                  {bestOf.time || "—"}
                </td>
                <td className="px-6 py-4  font-JetBrainsMono">
                  {bestOf.language || "—"}
                </td>
              </motion.tr>
            </tbody>
          </motion.table>
        </>
      )} */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div
          key={records}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="min-w-full flex flex-col pb-10 gap-10 overflow-hidden text-primary col-span-full rounded-xl"
        >
          {/* Table Body */}
          <PaginatedItems
            items={records}
            itemsPerPage={10}
            renderItem={(record, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-thrid rounded-xl transition-colors"
              >
                <td className="px-6 py-4 text-primary font-JetBrainsMono">
                  {record.wpm || "—"}
                </td>
                <td className="px-6 py-4 text-primary font-JetBrainsMono">
                  {record.correct_char || "—"}
                </td>
                <td className="px-6 py-4 text-primary font-JetBrainsMono">
                  {record.incorrect_char || "—"}
                </td>
                <td className="px-6 py-4 text-primary font-JetBrainsMono">
                  {new Date(record.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 text-primary font-JetBrainsMono">
                  {record.time || "—"}
                </td>
                <td className="px-6 py-4 text-primary font-JetBrainsMono">
                  {record.word || "—"}
                </td>
                <td className="px-6 py-4 font-JetBrainsMono">
                  {record.language || "—"}
                </td>
              </motion.tr>
            )}
          />
        </motion.div>
        {/* {RecordChart} */}
      </div>
    </div>
  );
};

export default WpmRecords;
