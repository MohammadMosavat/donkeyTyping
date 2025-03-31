"use client";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";
import TypingGame from "@/components/Typing";
import commonWords from "@/data/commonWords";
import { WpmRecord } from "@/types";
import Link from "next/link";
import { ReactSVG } from "react-svg";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import SettingBar from "@/components/settingBar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const Home = () => {
  const quickStart = useSelector((state: RootState) => state.quickStart.value);
  const [time, setTime] = useState<number>(
    Number(localStorage.getItem("time") ?? 30)
  );
  const [words, setWords] = useState<number>(
    Number(localStorage.getItem("words") ?? 30)
  );
  const [resetTimer, setResetTimer] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  useAuth();

  const genRandomWord = () => {
    const newWords: string[] = [];
    console.log(words);
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

  const regenerateWords = (
    e: React.MouseEvent<HTMLButtonElement> | KeyboardEvent
  ) => {
    e.preventDefault();
    genRandomWord();
    setResetTimer(true);
    setIsTyping(false);
    setTimeout(() => setResetTimer(false), 100);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Escape") {
      setIsTyping(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && quickStart == "esc") {
        regenerateWords(event);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [regenerateWords, quickStart]);

  const Typing = useCallback(() => {
    return (
      <TypingGame
        data={selectedWords}
        time={time}
        word={words}
        resetTimer={resetTimer}
        showTimer={true}
        regenerateWords={genRandomWord}
      />
    );
  }, [selectedWords, time, resetTimer]);

  useEffect(() => {
    document.documentElement.className =
      localStorage.getItem("theme") ?? "theme-indigo-emerald";
  });

  const refreshShortCut = useMemo(() => {
    return (
      !isTyping &&
      quickStart !== "off" && (
        <ul>
          <li className="flex items-center gap-2">
            {quickStart == "default" ? (
              <>
                <span className="text-fourth font-JetBrainsMono p-1 px-2 rounded-xl bg-thrid text-sm">
                  tab
                </span>
                <span className="font-JetBrainsMono text-thrid">+</span>
                <span className="text-fourth font-JetBrainsMono p-1 px-2 rounded-xl bg-thrid text-sm">
                  enter
                </span>
              </>
            ) : (
              quickStart == "esc" && (
                <span className="text-fourth font-JetBrainsMono p-1 px-2 rounded-xl bg-thrid text-sm">
                  esc
                </span>
              )
            )}
            <span className="font-JetBrainsMono text-thrid">restart test</span>
          </li>
        </ul>
      )
    );
  }, [quickStart]);

  return (
    <main className="flex flex-col overflow-x-hidden items-center min-h-screen w-full">
      <section
        className={`flex md:w-3/12 flex-col items-center gap-6 md:gap-10 justify-center w-full ${
          !isTyping ? "visible" : "opacity-0 pointer-events-none"
        }`}
      >
        <SettingBar
          setTime={setTime}
          setWords={setWords}
          timeNumbers={[15, 30, 45, 60]}
          wordNumbers={[10, 30, 60, 80]}
        />
      </section>

      <form className="flex flex-col mx-auto gap-6 md:gap-8 w-full  items-center flex-1 justify-center">
        <div className="flex flex-col gap-6 md:gap-10 items-start justify-between w-full">
          {Typing()}
        </div>
        <button
          onClick={regenerateWords}
          className="hover:shadow-xl hover:drop-shadow-xl transition-all duration-200 ease-in-out !rounded-full p-2 md:p-3"
          tabIndex={quickStart === "esc" || quickStart === "off" ? -1 : 0}
        >
          <ReactSVG
            data-tooltip="Restart Test"
            src="/svgs/refresh.svg"
            className="[&>div>svg]:max-md:size-5  [&>div>svg]:size-6 outline-none md:[&>div>svg]:size-7 tooltip font-JetBrainsMono [&_*]:fill-primary"
          />
        </button>
        {refreshShortCut}
        {!isTyping && (
          <motion.footer
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`w-full ${
              !isTyping ? "visible" : "[&_*]:opacity-0 pointer-events-none"
            }`}
          >
            <Footer />
          </motion.footer>
        )}
      </form>
    </main>
  );
};

export default Home;
