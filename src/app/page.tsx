"use client";
import RandomWord from "@/hooks/randomWord";
import { useCallback, useMemo, useState } from "react";
import Timer from "./component/timer";

export default function Home() {
  const res = RandomWord(20, 20);
  console.log(res[0]);
  const [success, setSucceess] = useState<boolean>(null);
  const [score, setScore] = useState<number>(0);
  const [inputValue, setInputValue] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(0); // State to receive data from child

  const handleTimeUpdate = (time: number) => {
    setTimeLeft(time); // Update state with data from child
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInputValue(event.target.value);
    // const splitWord = res[0].split("");
  };

  useMemo(() => {
    Array.isArray(res) &&
      inputValue != "" &&
      res.map((char, index) => {
        if (char == inputValue && index == score) {
          setSucceess(true);
          console.log("char", char == inputValue, "index ", index);
          setScore(score + 1);
          setInputValue("");
          return 0;
        } else if (index == score) {
          setSucceess(false);
          console.log("char", char, "index ", index);
          return;
        }
      });
  }, [inputValue]);

  const renderWord = useCallback(() => {
    // const splitWord = ;

    return Array.isArray(res) ? (
      res.map((word: string, index: number) => {
        return (
          <li
            id={String(index)}
            key={index}
            className={`text-xl ${
              success ? "text-green-500" : "text-red-500"
            } ${success == null && "!text-white"} font-light`}
          >
            {word}
          </li>
        );
      })
    ) : (
      <p className="text-white">loading...</p>
    );
  }, [success, res]);

  return (
    <main className="flex bg-zinc-900 items-center justify-center h-screen">
      <form className="flex flex-col mx-auto gap-8 w-2/3 items-center">
        <ul className="flex items-center w-full flex-wrap gap-3">
          {renderWord()}
        </ul>
        <div className="flex items-start justify-evenly w-full">
          <input
            type="text"
            disabled={timeLeft == 0}
            value={inputValue}
            className="w-1/4 outline-none bg-zinc-700 text-white rounded-xl h-20 px-6"
            onChange={handleChange}
          />
          <section className="flex flex-col items-center gap-4">
            <p className="text-white">Score : {score}</p>
            <button
              className="text-white bg-zinc-700 rounded-2xl px-6 py-2 "
              onClick={() => setScore(0)}
            >
              Resert Score
            </button>
          </section>
          {Array.isArray(res) ? (
            <Timer onTimeUpdate={handleTimeUpdate} startTime={20} />
          ) : (
            <p className="text-white">loading...</p>
          )}
        </div>
      </form>
    </main>
  );
}
