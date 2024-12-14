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
import StatusTyping from "./component/statusTyping";
import { fetchWord } from "@/hooks/randomWord";
import Timer from "./component/statusTyping";
import NotificationAlert from "./component/toast";

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
    const getRes = async () => {
      const fetchedWords = await fetchWord(20, 10);
      setRes(fetchedWords);
    };

    getRes();
    if (inputRef.current) {
      inputRef.current.focus();
    }
    console.log(res);
  }, []);

  const resSplit =
    Array.isArray(res) &&
    res.map((char) => {
      return char.split("");
    });

  // console.log(res[0]);
  const handleTimeUpdate = (time: number) => {
    console.log(time);
    setTimeLeft(time); // Update state with data from child
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInputValue(event.target.value);
  };

  useEffect(() => {
    console.log(activeChar, resSplit && resSplit[activeWord]);
    resSplit &&
      resSplit[activeWord]?.map((char: string, index: number) => {
        console.log(
          "last value : ",
          inputValue?.split("")[inputValue.split("").length - 1]
        );
        if (inputValue && index == inputValue?.length - 1) {
          if (char == inputValue?.split("")[inputValue?.split("").length - 1]) {
            setSucceess(true);
            setActiveChar(inputValue?.length);
            if (inputValue == res[activeWord]) {
              setInputValue("");
              setScore(score + 1);
              setActiveWord(activeWord + 1);
            }
            // setActiveChar(3);
          } else {
            setSucceess(false);
            setActiveChar(inputValue?.length);
            if (inputValue?.length == res[activeWord].length) {
              setActiveWord(activeWord + 1);
              setInputValue("");
            }
          }

          // setActiveChar(activeChar + 1);
        } else {
        }
      });
  }, [inputValue?.length, activeChar, success]);

  useEffect(() => {
    inputValue == "" && setSucceess(false);
  }, [inputValue]);

  const renderWord = useCallback(() => {
    // const splitWord = ;
    console.log("this is active char ", activeChar);
    return Array.isArray(resSplit) ? (
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
                      "!text-green-500"} ${!success &&
                      inputValue != "" &&
                      activeWord == index &&
                      activeChar > charIndex &&
                      "!text-red-600"} text-white opacity-50 ${inputValue?.length ==
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
    ) : (
      <p className="text-white">loading...</p>
    );
  }, [success, activeChar, inputValue, res]);

  const scoreCounter = useMemo(() => {
    return (
      <section className="flex  items-center gap-4">
        <p className="text-white">Score : {score}</p>
      </section>
    );
  }, [score]);

  const timerCounter = useMemo(() => {
    return Array.isArray(res) &&
      success != null &&
      activeWord >= 0 &&
      timeLeft <= 20 ? (
      <Timer startTime={20} handleTimeUpdate={handleTimeUpdate} />
    ) : (
      <p className="text-white">Timer is waiting for typing</p>
    );
  }, [res, inputValue]);

  const handleRefresh = async () => {
    const fetchedWords = await fetchWord(20, 10);
    setRes(fetchedWords);
    setInputValue("");
    setSucceess(null);
    // setTimeLeft(0);
    setActiveWord(0);
    setActiveChar(0);
  };

  useEffect(() => {
    timeLeft == 0 && setInputValue("");
  }, [timeLeft]);

  const notification = useMemo(() => {
    return (
      <NotificationAlert
        className={`${timeLeft == 0 ? "!top-4" : "!-top-36"}`}
        status={"info"}
        alertTitle={"Time is over"}
        theme={"light"}
      />
    );
  }, [timeLeft]);

  return (
    <main className="flex  items-center justify-center h-screen">
      {notification}
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
              disabled={timeLeft == 0}
              onChange={handleChange}
              value={inputValue ?? ""}
              className="w-full p-4 rounded-xl text-white bg-glass transition duration-300 focus:outline-none focus:bg-glass "
              placeholder="Type here..."
            />
          </section>
          <div className="flex flex-col gap-2">
            {scoreCounter}
            {timerCounter}
          </div>
        </div>
      </form>
    </main>
  );
}
