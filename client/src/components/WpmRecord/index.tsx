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
        <p className="font-JetBrainsMono text-xs md:text-sm text-center text-primary">
          R1 : Record Number 1
        </p>
      </div>
    );
  }, []);

  return (
    <div className="w-full h-fit">
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <motion.div
          key={records.length}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full overflow-x-auto"
        >
          <div className="min-w-full flex flex-col pb-6 md:pb-10 gap-6 md:gap-10 text-primary rounded-xl">
            <div className="">
              <table className="min-w-full">
              
                <tbody>
                  <PaginatedItems
                    items={records}
                    itemsPerPage={10}
                    renderItem={(record, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-thrid/20 border-b border-secondary/10 transition-all duration-200 ease-in-out text-xs md:text-sm"
                      >
                        <td className="px-4 md:px-6 py-3 md:py-4 text-primary font-JetBrainsMono whitespace-nowrap">
                          {record.wpm || "—"}
                        </td>
                        <td className="hidden md:table-cell px-4 md:px-6 py-3 md:py-4 text-primary font-JetBrainsMono whitespace-nowrap">
                          {record.correct_char || "—"}
                        </td>
                        <td className="hidden md:table-cell px-4 md:px-6 py-3 md:py-4 text-primary font-JetBrainsMono whitespace-nowrap">
                          {record.incorrect_char || "—"}
                        </td>
                        <td className="hidden md:table-cell px-4 md:px-6 py-3 md:py-4 text-primary font-JetBrainsMono whitespace-nowrap">
                          {new Date(record.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long", 
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-primary font-JetBrainsMono whitespace-nowrap">
                          {record.time || "—"}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-primary font-JetBrainsMono whitespace-nowrap">
                          {record.word || "—"}
                        </td>
                        <td className="hidden md:table-cell px-4 md:px-6 py-3 md:py-4 font-JetBrainsMono whitespace-nowrap">
                          {record.language || "—"}
                        </td>
                      </motion.tr>
                    )}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default WpmRecords;
