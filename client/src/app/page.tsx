"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { getWord } from "@/hooks/randomWord";
import useAuth from "@/hooks/useAuth";
import TypingGame from "@/components/Typing";
import SplitText from "@/components/SplitText";
import commonWords from "@/data/commonWords";
import { WpmRecord } from "@/types";
const Home = () => {
  const [time, setTime] = useState<number>(
    Number(localStorage.getItem("time")) ?? 0
  ); // This will control the timer reset
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
        } else {
          toast.error(data.message || "Failed to fetch user data.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user data.");
      } finally {
      }
    };
    fetchBestRecordOfUserData();
  }, []);

  const regenerateWords = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    genRandomWord();
    toast.success("Words refreshed!");
  };

  const handleMissionComplete = () => {
    toast.success("Mission Complete! Generating new words...");
    genRandomWord();
  };
  const Typing = useCallback(() => {
    return (
      <TypingGame
        data={selectedWords} // Pass words to the child component
        time={time}
        showWpm={true}
        showTimer={true}
        bestOf={bestOf?.wpm ?? 0}
      />
    );
  }, [selectedWords, time]);
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      {/* <SplitText
        text={`Hello, ${localStorage.getItem('username')??'Unknown person'}!`}
        className="text-2xl text-white font-JetBrainsMono font-bold text-center"
        delay={150}
        animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
        animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
        threshold={0.2}
        rootMargin="-50px"
      /> */}
      <form className="flex flex-col mx-auto gap-8 w-11/12 items-center">
        <ul className="w-fit p-2 justify-self-center rounded-lg flex items-center gap-4">
          <li
            onClick={() => {
              localStorage.setItem("time", "30");
              setTime(30);
            }}
            className={`font-JetBrainsMono text-white px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              time === 30
                ? "bg-glass !rounded-lg text-black"
                : "hover:bg-white/10"
            }`}
          >
            30s
          </li>
          <li
            onClick={() => {
              localStorage.setItem("time", "60");
              setTime(60);
            }}
            className={`font-JetBrainsMono text-white px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              time === 60
                ? "bg-glass !rounded-lg text-black"
                : "hover:bg-white/10"
            }`}
          >
            60s
          </li>
          <li
            onClick={() => {
              localStorage.setItem("time", "90");
              setTime(90);
            }}
            className={`font-JetBrainsMono text-white px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              time === 90
                ? "bg-glass !rounded-lg text-black"
                : "hover:bg-white/10"
            }`}
          >
            90s
          </li>
          <li
            onClick={() => {
              localStorage.setItem("time", "120");
              setTime(120);
            }}
            className={`font-JetBrainsMono text-white px-4 py-2 rounded-lg cursor-pointer transition-colors ${
              time === 120
                ? "bg-glass !rounded-lg text-black"
                : "hover:bg-white/10"
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
          className=" hover:opacity-100 opacity-40 !rounded-full"
        >
          <img className="size-6" src="/svgs/refresh.svg" alt="" />
        </button>
      </form>
    </main>
  );
};

export default Home;
