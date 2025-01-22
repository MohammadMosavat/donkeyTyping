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
  const [isLastWordComplete, setIsLastWordComplete] = useState<boolean>(false);

  useEffect(() => {
    const randomWord = getWord(40);
    setRes(randomWord);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleLastWordComplete = (isComplete: boolean) => {
    setIsLastWordComplete(isComplete);
    if (isComplete) {
      // Generate new random words after the last word is completed
      const randomWord = getWord(40);
      setRes(randomWord);
    }
  };

  const handleMissionComplete = () => {
    toast("Keep Typing!");
    if (!isLastWordComplete) {
      // Generate new random words after the last word is completed
      const randomWord = getWord(40);
      setRes(randomWord);
    }
    console.log("Mission completed!", isLastWordComplete);
  };

  const showInput = useMemo(() => {
    console.log(res)
    return (
      <TypingGame
        data={res}
        onMissionComplete={handleMissionComplete}
        onLastWordComplete={handleLastWordComplete} // Pass the handler to TypingGame
      />
    );
  }, [res]);

  return (
    <main className="flex pt-40 items-center justify-center h-screen">
      <form className="flex flex-col mx-auto gap-8 w-11/12 items-center">
        <div className="flex flex-col gap-10 items-start justify-between w-full">
          {showInput}
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
