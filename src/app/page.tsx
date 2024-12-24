"use client";
// import RandomWord from "@/hooks/randomWord";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Timer from "./component/timer";
import toast from "react-hot-toast";
import { getWord } from "@/hooks/randomWord";
import Loading from "./component/loading";

export default function Home() {
  const [success, setSucceess] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(1);
  const [activeWord, setActiveWord] = useState<number>(0);
  const [activeChar, setActiveChar] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [res, setRes] = useState<string[]>([]);

  useLayoutEffect(() => {
    const randomWord = getWord(80);
    setRes(randomWord);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const resSplit =
    Array.isArray(res) &&
    res.map((char) => {
      return char.split("");
    });

  const handleTimeUpdate = (time: number) => {
    setTimeLeft(time); // Update state with data from child
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInputValue(event.target.value);
  };

  const WordsPerMinute = useMemo(() => {
    if (timeLeft == 0) {
      const word = res
        .slice(0, activeWord)
        .join()
        .replace(/,/g, "");
      // const lastWord = word[activeChar];
      console.log(word.length, word);
      const WPM: number = word.length / (5 * (120 / 60)); // 2 minute
      return <p className="text-[#cdcabb]">Word per minute : {WPM}</p>;
    }
  }, [timeLeft]);

  useEffect(() => {
    resSplit &&
      resSplit[activeWord]?.map((char: string, index: number) => {
        if (inputValue && index == inputValue?.length - 1) {
          console.log(
            inputValue == res[activeWord].slice(0, inputValue.length)
          );
          if (
            char == inputValue?.split("")[inputValue?.split("").length - 1] &&
            inputValue == res[activeWord].slice(0, inputValue.length)
          ) {
            setSucceess(true);
            setActiveChar(inputValue?.length);
            if (inputValue?.length == res[activeWord].length) {
              setInputValue("");
              setSucceess(false);
              setScore(score + 1);
              setActiveWord(activeWord + 1);
              if (res.length == activeWord + 1) {
                handleRefresh();
              }
            }
          } else {
            setSucceess(false);
            setActiveChar(inputValue?.length);
            if (inputValue?.length == res[activeWord].length) {
              setActiveWord(activeWord + 1);
              setSucceess(false);
              setInputValue("");
              if (res.length == activeWord + 1) {
                handleRefresh();
              }
            }
          }
        }
      });
  }, [inputValue?.length, activeChar, success, res]);

  useEffect(() => {
    inputValue == "" && setSucceess(false);
  }, [inputValue, res]);

  const renderWord = useCallback(() => {
    return (
      Array.isArray(resSplit) &&
      resSplit.map((word: string[], index: number) => {
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
                    className={`select-none text-xl $ ${success &&
                      activeWord == index &&
                      activeChar > charIndex &&
                      "!text-green-500 !opacity-100"} ${!success &&
                      inputValue != "" &&
                      activeWord == index &&
                      activeChar > charIndex &&
                      "!text-[#ca4200] !opacity-100"} text-white opacity-30 ${inputValue?.length ==
                      charIndex &&
                      activeWord == index &&
                      "underline-offset-8 underline !opacity-100"} transition-all duration-200 ease-in-out font-light`}
                  >
                    {char}
                  </li>
                );
              })}
          </p>
        );
      })
    );
  }, [success, activeChar, inputValue, res]);

  const scoreCounter = useMemo(() => {
    return (
      <section className="flex  items-center gap-4">
        <p className="text-[#cdcabb]">Score : {score}</p>
      </section>
    );
  }, [score]);

  const timerCounter = useMemo(() => {
    return Array.isArray(res) &&
      success != null &&
      activeWord >= 0 &&
      timeLeft <= 120 ? (
      <Timer startTime={120} handleTimeUpdate={handleTimeUpdate} />
    ) : (
      <p className="text-[#cdcabb]">Timer is waiting for typing</p>
    );
  }, [res, inputValue]);

  const handleRefresh = () => {
    const fetchedWords = getWord(80);
    setRes(fetchedWords);
    setInputValue("");
    setSucceess(null);
    setScore(0);
    // setTimeLeft(0);
    setActiveWord(0);
    setActiveChar(0);
  };

  useEffect(() => {
    if (timeLeft == 0) {
      setInputValue("");
      toast("Time is over");
    }
  }, [timeLeft]);

  return (
    <main className="flex  items-center justify-center h-screen">
      {Array.isArray(resSplit) ? (
        <form className="flex flex-col mx-auto gap-8 w-2/3 items-center">
          <ul className="flex items-center w-full gap-4 flex-wrap">
            {renderWord()}
          </ul>
          <div className="flex flex-col gap-10 items-start justify-between w-full">
            {/* <input
            ref={inputRef}
            type="text"
            disabled={!!timeLeft}
            value={inputValue}
            className="w-1/4 outline-none bg-zinc-700 text-white rounded-xl h-20 px-6"
            onChange={handleChange}
          /> */}
            <section className="w-1/2 flex gap-4 items-center mx-auto">
              <img
                onClick={handleRefresh}
                className={`cursor-pointer hover:shadow-md hover:drop-shadow-lg`}
                src="/svgs/refresh.svg"
                alt=""
              />
              <input
                ref={inputRef}
                type="text"
                onChange={handleChange}
                value={inputValue ?? ""}
                className="w-full p-4 rounded-xl text-white bg-glass transition duration-300 focus:outline-none focus:bg-glass "
                placeholder="Type here..."
              />
            </section>
            <div className="flex flex-col gap-2">
              {scoreCounter}
              {timerCounter}
              <p className="text-[#cdcabb]">{WordsPerMinute}</p>
            </div>
          </div>
        </form>
      ) : (
        <Loading />
      )}
    </main>
  );
}
