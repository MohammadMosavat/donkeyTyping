import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface TypingGameProps {
  data: string[];
  onMissionComplete: () => void;
  showWpm: boolean;
  showTimer: boolean;
  keyUniqe?: number;
}

export default function TypingGame({
  data,
  onMissionComplete,
  showWpm,
  showTimer,
  keyUniqe,
}: TypingGameProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const wordsToType = data;

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    setIsFocused(true);
  }, []);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (timeLeft > 0 && !gameOver) {
        isFocused && setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      } else {
        setGameOver(true);
        calculateResults();
        // if (onMissionComplete) onMissionComplete();
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [timeLeft, gameOver, isFocused, onMissionComplete]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        setIsFocused(true);
        inputRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    calculateResults();
  }, [input]);

  const calculateResults = () => {
    if (!startTime) return;
    // Calculate WPM based on entire text input
    const totalTimeInMinutes = 30 / 60;
    const currentWord = wordsToType[currentWordIndex];
    console.log("Current word:", currentWord, charCount);
    const totalWordsTyped = input;

    console.log(" totalWordsTyped ", totalWordsTyped);
    const wpmCalc = Math.round(charCount / (5 * totalTimeInMinutes));
    setWpm(wpmCalc);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    setCharCount(charCount + 1);

    if (!startTime) {
      setStartTime(Date.now());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      setInput("");
      setCharCount(charCount + 1);
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
    }
  };

  const getWordStyle = (index: number) => {
    return index === currentWordIndex ? "text-white underline" : "!opacity-30";
  };

  const getCharStyle = (char: string, index: number) => {
    if (index < input.length) {
      return char === input[index] ? "text-green-500" : "text-red-500";
    }
    return "";
  };

  const textsType = useMemo(() => {
    return wordsToType.map((word, wordIndex) => {
      const isCurrentWord = wordIndex === currentWordIndex;
      const extraChars = isCurrentWord ? input.slice(word.length) : "";

      return (
        <motion.span
          key={wordIndex}
          className={`${getWordStyle(
            wordIndex
          )} font-JetBrainsMono font-extralight text-xl select-none`}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {word.split("").map((char, charIndex) => (
            <span
              key={charIndex}
              className={isCurrentWord ? getCharStyle(char, charIndex) : ""}
            >
              {char}
            </span>
          ))}
          {/* Extra characters typed (shown in red) */}
          {isCurrentWord && extraChars.length > 0 && (
            <span className="text-red-500">{extraChars}</span>
          )}
        </motion.span>
      );
    });
  }, [input, wordsToType, currentWordIndex]);

  return (
    <div className="flex flex-col items-center mx-auto mt-16">
      <main className="relative w-10/12 mx-auto">
        <motion.label
          htmlFor="test"
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`text-white font-JetBrainsMono flex items-center justify-center gap-2 w-full h-full place-content-center text-center absolute ${isFocused &&
            "hidden"}`}
        >
          <Image
            src={`/svgs/cursor.svg`}
            width={24}
            height={24}
            alt={"cursor"}
          />
          <p>Click here to focus</p>
        </motion.label>
        <label
          htmlFor="test"
          className={` ${!isFocused &&
            "blur-sm"} mb-4 text-white mx-auto w-full flex gap-2.5 flex-wrap justify-center`}
        >
          {textsType}
        </label>
      </main>

      <input
        id="test"
        ref={inputRef}
        type="search"
        value={input}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
        autoCorrect="off"
        onChange={handleChange}
        className="rounded-full opacity-0 focus:outline-none h-0.5 w-0.5 font-JetBrainsMono bg-glass text-white"
        disabled={gameOver}
      />

      <div className="mt-6 text-white">
        {showTimer && (
          <div className="text-white font-JetBrainsMono">{timeLeft}</div>
        )}
        {showWpm &&
          gameOver&&(
            <p className="fognt-JetBrainsMono">Words Per Minute: {wpm}</p>
          )}
        {/* <p className="font-JetBrainsMono">Accuracy: {accuracy}%</p> */}
      </div>

      {gameOver && (
        <div className="mt-6 text-white">
          <p className="text-2xl font-semibold font-JetBrainsMono">
            Game Over!
          </p>
        </div>
      )}
    </div>
  );
}
