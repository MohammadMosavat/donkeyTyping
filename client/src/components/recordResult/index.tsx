import UserProfileCardProps, { WpmRecord } from "@/types";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import LineChart from "../Charts";
import { motion } from "framer-motion";
import axios from "axios";
import Loading from "../loading";
import Link from "next/link";
import { ReactSVG } from "react-svg";

interface RecordResultType {
  isOver: boolean;
  wpm: number;
  corChar: number;
  inChar: number;
  acc: number;
}
const RecordResult = ({
  acc,
  corChar,
  inChar,
  isOver,
  wpm,
}: RecordResultType) => {
  const [data, setData] = useState<WpmRecord>();
  const [loading, setLoading] = useState(true);
  //chart

  useEffect(() => {
    // Fetch user data from the API
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/store_wpm?username=${localStorage.getItem(
            "username"
          )}`
        );
        setData(response.data);
      } catch (err) {
        console.log("Failed to fetch records.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const lastFiveRecordsChart = useMemo(() => {
    if (loading) <Loading />;
    if (!Array.isArray(data) || !data) return;
    const lastFive = Array.isArray(data) && data?.slice(-5);
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
    return <LineChart labels={labels} datasets={datasets} title={title} />;
  }, [data]);
  // <LineChart labels={labels} datasets={datasets} title={title} />
  console.log("last five record ", lastFiveRecordsChart);

  return (
    <motion.div
      key={isOver}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full gap-10 text-white p-4 !pb-0 sm:p-8 md:p-10"
    >
      {/* <img
        className="fixed top-0 left-0 right-0 blur-lg bottom-0 -z-30 scale-110 w-full h-screen"
        src={"/images/bg10.jpg"}
        alt="Background"
      /> */}
      <div className="w-full grid grid-cols-4 mx-auto h-min gap-10 ">
        <section className="col-span-full flex flex-col items-center justify-between gap-4 sm:gap-6">
          <section className="flex justify-between items-start gap-4 sm:gap-6">
            <p className="font-JetBrainsMono text-primary text-center sm:text-left">
              Words Per Minute: {wpm}wpm
            </p>
            <p className="font-JetBrainsMono text-primary text-center sm:text-left">
              Accuracy: {acc}%
            </p>

            {/* Display correct and incorrect characters */}
            {/* <p className="font-JetBrainsMono text-primary text-center sm:text-left">
              Correct Characters: {corChar}
            </p> */}
            <p className="font-JetBrainsMono text-primary text-center sm:text-left">
              Incorrect Characters: {inChar}
            </p>
          </section>
          
        </section>
        {/* <div className="col-span-3 flex flex-col gap-3">
          <section className="flex items-center gap-2">
            <ReactSVG
              src="/svgs/chart.svg"
              className="[&>div>svg]:size-8 [&>div>svg_*]:stroke-primary"
            />
            <h1 className="text-2xl font-JetBrainsMono text-primary">
              Last 5 Record Chart
            </h1>
          </section>
          {lastFiveRecordsChart}
        </div> */}

        {/* <button
          title="Next"
          onClick={() => window.location.reload()}
          className="hover:shadow-xl hover:drop-shadow-2xl mx-auto col-span-full !rounded-full"
        >
          <ReactSVG
            src="/svgs/next.svg"
            className="[&>div>svg]:size-8 [&_*]:stroke-primary"
          />
        </button> */}
      </div>
    </motion.div>
  );
};

export default RecordResult;
