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
  );
  const [words, setWords] = useState<number>(
    Number(localStorage.getItem("words")) ?? 30
  );
  const [resetTimer, setResetTimer] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  useAuth();

  const genRandomWord = () => {
    const newWords: string[] = [];

    while (newWords.length < words) {
      const randomArray =
        commonWords[Math.floor(Math.random() * commonWords.length)];
      const randomWord =
        randomArray[Math.floor(Math.random() * randomArray.length)];

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
  }, [time, words]);

  const regenerateWords = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    genRandomWord();
    setResetTimer(true);
    setTimeout(() => setResetTimer(false), 100);
  };

  const Typing = useCallback(() => {
    return (
      <TypingGame
        data={selectedWords}
        time={time}
        word={words}
        resetTimer={resetTimer}
        showTimer={true}
        regenerateWords={genRandomWord} // Pass the function
      />
    );
  }, [selectedWords, time, resetTimer]);

  useEffect(() => {
    document.documentElement.className =
      localStorage.getItem("theme") ?? "theme-indigo-emerald";
  });

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <form className="flex flex-col mx-auto gap-8 w-10/12 items-center">
        <section className="flex items-center gap-10 justify-self-center">
          <div className="flex items-center gap-4">
            <ReactSVG
              data-tooltip="Timer"
              src="/svgs/timer.svg"
              className="[&>div>svg]:size-6 font-JetBrainsMono tooltip [&_*]:stroke-primary"
            />
            <ul className="w-fit justify-self-center rounded-xl flex items-center gap-10">
              <li
                onClick={() => {
                  localStorage.setItem("words", "30");
                  setTime(30); // Set to 30 seconds and reset
                }}
                className={`font-JetBrainsMono hover:text-primary text-thrid rounded-xl cursor-pointer transition-colors ${
                  time === 30
                    ? "!rounded-xl !text-primary"
                    : "hover:!opacity-100"
                }`}
              >
                30s
              </li>
              <li
                onClick={() => {
                  localStorage.setItem("words", "60");
                  setTime(60); // Set to 60 seconds and reset
                }}
                className={`font-JetBrainsMono hover:text-primary text-thrid rounded-xl cursor-pointer transition-colors ${
                  time === 60
                    ? "!rounded-xl !text-primary"
                    : "hover:!opacity-100"
                }`}
              >
                60s
              </li>
              <li
                onClick={() => {
                  localStorage.setItem("words", "90");
                  setTime(90); // Set to 90 seconds and reset
                }}
                className={`font-JetBrainsMono hover:text-primary text-thrid rounded-xl cursor-pointer transition-colors ${
                  time === 90
                    ? "!rounded-xl !text-primary"
                    : "hover:!opacity-100"
                }`}
              >
                90s
              </li>
              <li
                onClick={() => {
                  localStorage.setItem("words", "120");
                  setTime(120); // Set to 120 seconds and reset
                }}
                className={`font-JetBrainsMono hover:text-primary text-thrid rounded-xl cursor-pointer transition-colors ${
                  time === 120
                    ? "!rounded-xl !text-primary"
                    : "hover:!opacity-100"
                }`}
              >
                120s
              </li>
            </ul>
          </div>
          <div className="flex items-center gap-4">
            <ReactSVG
              data-tooltip="Number of words"
              src="/svgs/text.svg"
              className="[&>div>svg]:size-6 font-JetBrainsMono tooltip [&_*]:stroke-primary"
            />
            <ul className="w-fit justify-self-center rounded-xl flex items-center gap-10">
              <li
                onClick={() => {
                  localStorage.setItem("words", "10");
                  setWords(10); // Set to 10 seconds and reset
                }}
                className={`font-JetBrainsMono hover:text-primary text-thrid rounded-xl cursor-pointer transition-colors ${
                  words === 10
                    ? "!rounded-xl !text-primary"
                    : "hover:!opacity-100"
                }`}
              >
                10
              </li>
              <li
                onClick={() => {
                  localStorage.setItem("words", "20");
                  setWords(20); // Set to 20 seconds and reset
                }}
                className={`font-JetBrainsMono hover:text-primary text-thrid rounded-xl cursor-pointer transition-colors ${
                  words === 20
                    ? "!rounded-xl !text-primary"
                    : "hover:!opacity-100"
                }`}
              >
                20
              </li>
              <li
                onClick={() => {
                  localStorage.setItem("words", "30");
                  setWords(30); // Set to 30 seconds and reset
                }}
                className={`font-JetBrainsMono hover:text-primary text-thrid rounded-xl cursor-pointer transition-colors ${
                  words === 30
                    ? "!rounded-xl !text-primary"
                    : "hover:!opacity-100"
                }`}
              >
                30
              </li>
              <li
                onClick={() => {
                  localStorage.setItem("words", "40");
                  setWords(40); // Set to 40 seconds and reset
                }}
                className={`font-JetBrainsMono hover:text-primary text-thrid rounded-xl cursor-pointer transition-colors ${
                  words === 40
                    ? "!rounded-xl !text-primary"
                    : "hover:!opacity-100"
                }`}
              >
                40
              </li>
              <li
                onClick={() => {
                  localStorage.setItem("words", "80");
                  setWords(80); // Set to 120 seconds and reset
                }}
                className={`font-JetBrainsMono hover:text-primary text-thrid rounded-xl cursor-pointer transition-colors ${
                  words === 80
                    ? "!rounded-xl !text-primary"
                    : "hover:!opacity-100"
                }`}
              >
                80
              </li>
            </ul>
          </div>
        </section>

        <div className="flex flex-col gap-10 items-start justify-between w-full">
          {Typing()}
        </div>
        <button
          tabIndex={0}
          onClick={regenerateWords}
          className=" hover:shadow-xl hover:drop-shadow-xl transition-all duration-200 ease-in-out !rounded-full"
        >
          <ReactSVG
            data-tooltip="Restart Test"
            src="/svgs/refresh.svg"
            className="[&>div>svg]:size-6 tooltip font-JetBrainsMono [&_*]:fill-primary"
          />
        </button>
        <motion.footer
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Footer />
        </motion.footer>
      </form>
    </main>
  );
};

export default Home;
