"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../loading";
import { WpmRecord } from "@/types";
import toast from "react-hot-toast";
import LineChart from "../Charts";
import PaginatedItems from "../PaginationItems";
import Button from "../MainButton";
import { ReactSVG } from "react-svg";

const WpmRecords = ({ records }: { records: WpmRecord[] }) => {
  const [bestOf, setBestOf] = useState<WpmRecord>();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

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

  const availableDates = useMemo(() => {
    const dates = new Set(
      records.reverse().map((record) =>
        new Date(record.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      )
    );
    return Array.from(dates);
  }, [records]);

  const RecordChart = useMemo(() => {
    const lastFive = Array.isArray(records) && records?.slice(-5);
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

  const filteredRecords = useMemo(() => {
    if (!selectedDate) return records;
    return records.filter((record) => {
      const recordDate = new Date(record.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return recordDate === selectedDate;
    });
  }, [records, selectedDate]);

  const handleDateClick = (date: string) => {
    setIsFiltering(true);
    if (selectedDate === date) {
      setSelectedDate(null);
    } else {
      setSelectedDate(date);
    }
    setShowDateDropdown(false);
    setTimeout(() => setIsFiltering(false), 300);
  };

  return (
    <div className="w-full flex flex-col gap-10 h-fit">
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex max-md:flex-col justify-between md:items-center border-b border-thrid p-4"
          >
            <span className="font-JetBrainsMono text-sm md:text-base text-primary">
              {selectedDate}
            </span>
            <Button
              variant="ghost"
              onClick={() => handleDateClick(selectedDate)}
              className="text-sm px-4 py-2 rounded-lg font-JetBrainsMono text-primary hover:text-primary hover:bg-thrid transition-all duration-200 ease-in-out"
            >
              Clear filter
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        variant="ghost"
        onClick={() => setShowDateDropdown(!showDateDropdown)}
        className="relative flex !rounded-xl  items-center gap-6"
      >
        <section className="flex items-center gap-2">
          <ReactSVG
            src="/svgs/filters.svg"
            className="[&_*]:max-md:size-5 [&_*]:size-6 [&_*]:stroke-primary"
          />
          <span>Filter by Date</span>
        </section>
        <ReactSVG
          src="/svgs/arrow-down.svg"
          className={`[&>div>svg]:max-md:size-5  [&>div>svg]:size-6 [&_*]:stroke-primary transition-transform duration-200 ${
            showDateDropdown ? "rotate-180" : ""
          }`}
        />
        {showDateDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-glass rounded-xl shadow-lg backdrop-blur-sm z-10">
            {availableDates.map((date, index) => (
              <div
                key={index}
                className="px-4 py-2 rounded-xl hover:bg-thrid transition-all duration-200 ease-in-out cursor-pointer text-primary"
                onClick={() => handleDateClick(date)}
              >
                {date}
              </div>
            ))}
          </div>
        )}
      </Button>

      <PaginatedItems
        items={filteredRecords}
        itemsPerPage={10}
        renderItem={(record, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: "easeOut",
            }}
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 rounded-xl p-4 mb-4 border border-thrid hover:bg-thrid transition-all duration-300 ease-in-out ${
              isFiltering ? "opacity-50" : ""
            }`}
          >
            <div className="flex flex-col">
              <span className="text-xs font-JetBrainsMono text-primary">
                WPM
              </span>
              <span className="font-JetBrainsMono text-primary">
                {record.wpm || "—"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-JetBrainsMono text-primary">
                Time / Words
              </span>
              <span className="font-JetBrainsMono text-primary">
                {record.time || "—"} / {record.word || "—"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-JetBrainsMono text-primary">
                Correct / Incorrect
              </span>
              <span className="font-JetBrainsMono text-primary">
                {record.correct_char || "—"} / {record.incorrect_char || "—"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-JetBrainsMono text-primary">
                Date
              </span>
              <span className="font-JetBrainsMono text-primary">
                {new Date(record.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </motion.div>
        )}
      />
    </div>
  );
};

export default WpmRecords;
