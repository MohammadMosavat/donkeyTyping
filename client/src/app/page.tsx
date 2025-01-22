"use client";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import Loading from "@/components/loading";
import { getWord } from "@/hooks/randomWord";
import Timer from "../components/timer";
import { motion } from "framer-motion";
import SettingSection from "@/components/SettingSection";
import TypingGame from "@/components/Typing";
const Home = () => {
  const [success, setSucceess] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(1);
  const [activeWord, setActiveWord] = useState<number>(0);
  const [activeChar, setActiveChar] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [res, setRes] = useState<string[]>([]);

  useLayoutEffect(() => {
    const randomWord = getWord(40);
    setRes(randomWord);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  // const resSplit =
  //   Array.isArray(res) &&
  //   res.map((char) => {
  //     return char.split("");
  //   });

  // const handleTimeUpdate = (time: number) => {
  //   setTimeLeft(time); // Update state with data from child
  // };

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   event.preventDefault();
  //   setInputValue(event.target.value);
  // };

  // const WordsPerMinute = useMemo(() => {
  //   if (timeLeft == 0) {
  //     const word = res
  //       .slice(0, activeWord)
  //       .join()
  //       .replace(/,/g, "");
  //     // const lastWord = word[activeChar];
  //     const WPM: number = word.length / (5 * (120 / 60)); // 2 minute
  //     return `Word per minute : ${WPM}`;
  //   }
  // }, [timeLeft]);

  // useEffect(() => {
  //   resSplit &&
  //     resSplit[activeWord]?.map((char: string, index: number) => {
  //       if (inputValue && index == inputValue?.length - 1) {
  //         if (
  //           char == inputValue?.split("")[inputValue?.split("").length - 1] &&
  //           inputValue == res[activeWord].slice(0, inputValue.length)
  //         ) {
  //           setSucceess(true);
  //           setActiveChar(inputValue?.length);
  //           if (inputValue?.length == res[activeWord].length) {
  //             setInputValue("");
  //             setSucceess(false);
  //             setScore(score + 1);
  //             setActiveWord(activeWord + 1);
  //             if (res.length == activeWord + 1) {
  //               handleRefresh();
  //             }
  //           }
  //         } else {
  //           setSucceess(false);
  //           setActiveChar(inputValue?.length);
  //           if (inputValue?.length == res[activeWord].length) {
  //             setActiveWord(activeWord + 1);
  //             setSucceess(false);
  //             setInputValue("");
  //             if (res.length == activeWord + 1) {
  //               handleRefresh();
  //             }
  //           }
  //         }
  //       }
  //     });
  // }, [inputValue?.length, activeChar, success, res]);

  // useEffect(() => {
  //   inputValue == "" && setSucceess(false);
  // }, [inputValue, res]);

  // const renderWord = useCallback(() => {
  //   console.log(resSplit);
  //   return (
  //     Array.isArray(resSplit) &&
  //     resSplit.map((word: string[], index: number) => {
  //       return (
  //         <p
  //           key={index}
  //           id={String(index)}
  //           className="flex gap-0.5 font-JetBrainsMono items-center"
  //         >
  //           {Array.isArray(word) &&
  //             word.map((char, charIndex) => {
  //               return (
  //                 <li
  //                   id={String(charIndex)}
  //                   key={charIndex}
  //                   className={`select-none text-xl $ ${success &&
  //                     activeWord == index &&
  //                     activeChar > charIndex &&
  //                     "!text-green-500 !opacity-100"} ${!success &&
  //                     inputValue != "" &&
  //                     activeWord == index &&
  //                     activeChar > charIndex &&
  //                     "!text-[#ca4200] !opacity-100"} text-white opacity-30 ${inputValue?.length ==
  //                     charIndex &&
  //                     activeWord == index &&
  //                     "underline-offset-8 underline !opacity-100"} transition-all duration-200 ease-in-out font-light`}
  //                 >
  //                   {char}
  //                 </li>
  //               );
  //             })}
  //         </p>
  //       );
  //     })
  //   );
  // }, [success, activeChar, activeWord, inputValue, res]);

  // const scoreCounter = useMemo(() => {
  //   return (
  //     <section className="flex  items-center gap-2">
  //       <p className="text-white font-Aspekta">Score :</p>
  //       <motion.p
  //         className="text-white"
  //         initial={{ opacity: 0, y: 10 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         transition={{ duration: 0.5 }}
  //         key={score}
  //       >
  //         {score}
  //       </motion.p>
  //     </section>
  //   );
  // }, [score]);

  // const timerCounter = useMemo(() => {
  //   return Array.isArray(res) &&
  //     success != null &&
  //     activeWord >= 0 &&
  //     timeLeft <= 60 ? (
  //     <Timer startTime={60} handleTimeUpdate={handleTimeUpdate} />
  //   ) : (
  //     <p className="text-white font-Aspekta">Timer is waiting for typing</p>
  //   );
  // }, [res, inputValue]);

  // const handleRefresh = () => {
  //   const fetchedWords = getWord(40);
  //   setRes(fetchedWords);
  //   setInputValue("");
  //   setSucceess(null);
  //   setScore(0);
  //   setTimeLeft(0);
  //   setActiveWord(0);
  //   setActiveChar(0);
  // };

  // useEffect(() => {
  //   if (timeLeft == 0) {
  //     setInputValue("");
  //     toast("Time is over");
  //   }
  // }, [timeLeft]);

  const handleMissionComplete = () => {
    toast("Mission Complete! All words have been typed correctly!");
  };

  return (
    <main className="flex pt-40 items-center justify-center h-screen">
      
        <form className="flex flex-col mx-auto gap-8 w-11/12 items-center">
          <div className="flex flex-col gap-10 items-start justify-between w-full">
            <TypingGame data={res} onMissionComplete={handleMissionComplete} />
            <section className="flex justify-between items-start w-full">
              <SettingSection />
              {/* <div className="flex bg-glass p-3 flex-col gap-2">
                {scoreCounter}
                {timerCounter}
                {WordsPerMinute && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-white font-Aspekta"
                  >
                    {WordsPerMinute}
                  </motion.p>
                )}
              </div> */}
            </section>
          </div>
        </form>
      
    </main>
  );
};

export default Home;
