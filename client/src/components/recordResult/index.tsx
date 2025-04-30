import UserProfileCardProps, { WpmRecord } from "@/types";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import LineChart from "../Charts";
import { motion } from "framer-motion";
import axios from "axios";
import Loading from "../loading";
import Link from "next/link";
import { ReactSVG } from "react-svg";
import useUser from "@/hooks/useUser";

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
  const { user } = useUser();
  const username = user[0]?.username;
  return (
    <motion.div
      key={isOver}
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full gap-10 text-white p-4 !pb-0 sm:p-8 md:p-10"
    >
      <section className="w-full flex flex-col items-center justify-between gap-4 sm:gap-6">
        <section className="flex justify-between items-start gap-4 sm:gap-6">
          <p className="font-JetBrainsMono text-primary text-center sm:text-left">
            Words Per Minute: {wpm}wpm
          </p>
          <p className="font-JetBrainsMono text-primary text-center sm:text-left">
            Accuracy: {acc}%
          </p>
          <p className="font-JetBrainsMono text-primary text-center sm:text-left">
            Incorrect Characters: {inChar}
          </p>
        </section>
        {!user ? (
          <Link
            href={"/register/signup"}
            className="font-JetBrainsMono w-fit mx-auto p-1.5 bg-thrid rounded-xl "
          >
            Save your progress
          </Link>
        ) : (
          <Link
            href={`/${username}/sort?filter=newest`}
            className="font-JetBrainsMono w-fit mx-auto p-1.5 bg-thrid rounded-xl "
          >
            check the records
          </Link>
        )}
      </section>
    </motion.div>
  );
};

export default RecordResult;
