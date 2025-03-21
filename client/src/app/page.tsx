"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import TypingGame from "@/components/Typing";
import commonWords from "@/data/commonWords";
import { WpmRecord } from "@/types";
import Link from "next/link";
import { ReactSVG } from "react-svg";
import Footer from "@/components/footer";
import { motion } from "framer-motion";

const Home = () => {
  const [time, setTime] = useState<number>(
    Number(localStorage.getItem("time")) ?? 30
  ); // Default to 30 seconds if no time is stored
  const [resetTimer, setResetTimer] = useState(false); // To trigger the reset of the timer in TypingGame
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [bestOf, setBestOf] = useState<WpmRecord>();

  useAuth();

  const genRandomWord = () => {
    const newWords: string[] = [];

    // Pick random arrays and push words into newWords
    while (newWords.length < 40) {
      const randomArray =
        commonWords[Math.floor(Math.random() * commonWords.length)];
      const randomWord =
        randomArray[Math.floor(Math.random() * randomArray.length)];

      // Ensure no duplicates
      if (!newWords.includes(randomWord)) {
        newWords.push(randomWord);
      }
    }

    setSelectedWords(newWords);
  };

  useEffect(() => {
    genRandomWord();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [time]);

  useEffect(() => {
    const fetchBestRecordOfUserData = async () => {
      console.log(localStorage.getItem('username'))
      try {
        const response = await fetch(
          `http://localhost:5000/store_wpm?username=${localStorage.getItem(
            "username"
          )}&sort=highest`
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setBestOf(data[0]);
          console.log(data);
        }
      } catch (error) {
        toast.error("An error occurred while fetching user data.");
      }
    };
    fetchBestRecordOfUserData();
  }, []);

  const regenerateWords = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    genRandomWord();
    setResetTimer(true); // Trigger the reset of the timer
    setTimeout(() => setResetTimer(false), 100); // Reset after a small delay to allow the timer to reset
  };

  const Typing = useCallback(() => {
    return (
      <TypingGame
        data={selectedWords} // Pass words to the child component
        time={time}
        resetTimer={resetTimer} // Pass the reset state
        showWpm={true}
        showTimer={true}
        bestOf={bestOf?.wpm ?? 0}
      />
    );
  }, [selectedWords, time, resetTimer, bestOf]);

  useEffect(() => {
    document.documentElement.className =
      localStorage.getItem("theme") ?? "theme-indigo-emerald";
  });

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <form className="flex flex-col mx-auto gap-8 w-10/12 items-center">
        <ul className="w-fit justify-self-center rounded-xl flex items-center gap-10">
          <li
            onClick={() => {
              localStorage.setItem("time", "30");
              setTime(30); // Set to 30 seconds and reset
            }}
            className={`font-JetBrainsMono hover:text-primary text-thrid rounded-xl cursor-pointer transition-colors ${
              time === 30 ? "!rounded-xl !text-primary" : "hover:!opacity-100"
            }`}
          >
            30s
          </li>
          <li
            onClick={() => {
              localStorage.setItem("time", "60");
              setTime(60); // Set to 60 seconds and reset
            }}
            className={`font-JetBrainsMono hover:text-primary text-thrid rounded-xl cursor-pointer transition-colors ${
              time === 60 ? "!rounded-xl !text-primary" : "hover:!opacity-100"
            }`}
          >
            60s
          </li>
          <li
            onClick={() => {
              localStorage.setItem("time", "90");
              setTime(90); // Set to 90 seconds and reset
            }}
            className={`font-JetBrainsMono hover:text-primary text-thrid rounded-xl cursor-pointer transition-colors ${
              time === 90 ? "!rounded-xl !text-primary" : "hover:!opacity-100"
            }`}
          >
            90s
          </li>
          <li
            onClick={() => {
              localStorage.setItem("time", "120");
              setTime(120); // Set to 120 seconds and reset
            }}
            className={`font-JetBrainsMono hover:text-primary text-thrid rounded-xl cursor-pointer transition-colors ${
              time === 120 ? "!rounded-xl !text-primary" : "hover:!opacity-100"
            }`}
          >
            120s
          </li>
        </ul>

        <div className="flex flex-col gap-10 items-start justify-between w-full">
          {Typing()}
        </div>
        <button
          onClick={regenerateWords}
          className=" hover:shadow-xl hover:drop-shadow-xl transition-all duration-200 ease-in-out !rounded-full"
        >
          <ReactSVG
            src="/svgs/refresh.svg"
            className="[&>div>svg]:size-6 [&_*]:fill-primary"
          />
        </button>
        <motion.footer
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Footer theme={document.documentElement.className} />
        </motion.footer>
      </form>
    </main>
  );
};

export default Home;
