"use client";
import RandomWord from "@/hooks/randomWord";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Timer from "./component/timer";

export default function Home() {
  const res = RandomWord(20, 10);
  const [success, setSucceess] = useState<boolean>(null);
  const [score, setScore] = useState<number>(0);
  const [inputValue, setInputValue] = useState("");
  const [timeLeft, setTimeLeft] = useState<number>(0); // State to receive data from child
  const [activeWord, setActiveWord] = useState<number>(0);
  const [activeChar, setActiveChar] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const resSplit =
    Array.isArray(res) &&
    res.map((char) => {
      return char.split("");
    });

  // console.log(res[0]);
  const handleTimeUpdate = (time: number) => {
    setTimeLeft(time); // Update state with data from child
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const lastWordOfInput =
      event.target.value.split("")[event.target.value.split("").length - 1];
    // console.log(
    //   "last input value :",
    //   lastWordOfInput,
    //   event.target.value.length - 1
    // );
    setInputValue(event.target.value);
    // const splitWord = res[0].split("");
  };

  useEffect(() => {
    console.log(activeChar, resSplit && resSplit[activeWord]);
     resSplit &&
      resSplit[activeWord]?.map((char: string, index: number) => {
        console.log(
          "last value : ",
          inputValue.split("")[inputValue.split("").length - 1]
        );
        if (index == inputValue.length - 1) {
          if (char == inputValue.split("")[inputValue.split("").length - 1]) {
            setSucceess(true);
            setActiveChar(inputValue.length);
            if (inputValue == res[activeWord]) {
              setInputValue("");
              setScore(score + 1);
              setActiveWord(activeWord + 1);
            }
            // setActiveChar(3);
          } else {
            setSucceess(false);
            setActiveChar(inputValue.length);
            if (inputValue.length == res[activeWord].length) {
              setActiveWord(activeWord + 1);
              setInputValue("");
            }
          }

          // setActiveChar(activeChar + 1);
        } else {
        }
      });
  }, [inputValue.length, activeChar, success]);

  useEffect(() => {
    inputValue == "" && setSucceess(false);
  }, [inputValue]);

  const renderWord = useCallback(() => {
    // const splitWord = ;
    console.log("this is active char ", activeChar);
    return Array.isArray(resSplit) ? (
      resSplit.map((word: string, index: number) => {
        return (
          <p
            key={index}
            id={String(index)}
            className="flex gap-0.5 items-center"
          >
            {Array.isArray(word) &&
              word.map((char, charIndex) => {
                return (
                  <li
                    id={String(charIndex)}
                    key={charIndex}
                    className={`text-xl $ ${
                      success &&
                      activeWord == index &&
                      activeChar > charIndex &&
                      "!text-green-500"
                    } ${
                      !success &&
                      inputValue != "" &&
                      activeWord == index &&
                      activeChar > charIndex &&
                      "!text-red-500"
                    } text-white opacity-50 ${
                      inputValue.length == charIndex &&
                      activeWord == index &&
                      "underline-offset-4 underline !opacity-100"
                    } font-light`}
                  >
                    {char}
                  </li>
                );
              })}
          </p>
        );
      })
    ) : (
      <p className="text-white">loading...</p>
    );
  }, [success, activeChar, inputValue, res]);

  return (
    <main className="flex bg-zinc-900 items-center justify-center h-screen">
      <form className="flex flex-col mx-auto gap-8 w-2/3 items-center">
        <ul className="flex items-center w-full gap-4 flex-wrap">
          {renderWord()}
        </ul>
        <div className="flex items-start justify-evenly w-full">
          <input
            ref={inputRef}
            type="text"
            disabled={!!timeLeft}
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
