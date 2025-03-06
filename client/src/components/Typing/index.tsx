import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";

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
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  console.log(data);
  const wordsToType = data;

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();

    const timerInterval = setInterval(() => {
      if (timeLeft > 0 && !gameOver) {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      } else {
        setGameOver(true);
        calculateResults();
        if (onMissionComplete) onMissionComplete();
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft, gameOver, onMissionComplete]);

  useEffect(() => {
    calculateResults();
  }, [input, currentWordIndex]);

  const calculateResults = () => {
    if (!startTime) return;
    const currentWord = wordsToType[currentWordIndex];
    const totalTimeInMinutes = (Date.now() - startTime) / 1000 / 60;
    const totalWordsTyped = 1 + correctCount + incorrectCount;
    const wpmCalc = Math.round(totalWordsTyped / 5 / totalTimeInMinutes);
    setWpm(wpmCalc);

    if (input[input.length - 1] === currentWord[input.length - 1]) {
      setCorrectCount(correctCount + 1);
    } else {
      setIncorrectCount(incorrectCount + 1);
    }

    const accuracyCalc = Math.round(
      (correctCount / (correctCount + incorrectCount)) * 100
    );
    setAccuracy(accuracyCalc);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (!startTime) {
      setStartTime(Date.now());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      e.preventDefault();
      setInput("");
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
    }
  };

  const getWordStyle = (index: number) => {
    if (index === currentWordIndex) {
      return "text-white underline";
    }
    return "!opacity-30";
  };

  const getCharStyle = (char: string, index: number) => {
    if (index < input.length && input !== "") {
      if (char === input[index]) {
        return "text-green-500";
      } else {
        return "text-red-500";
      }
    }
    return "";
  };

  const textsType = useMemo(() => {
    return wordsToType.map((word, wordIndex) => (
      <motion.span
        key={wordIndex}
        className={
          getWordStyle(wordIndex) +
          " font-JetBrainsMono font-extralight text-xl"
        }
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {word.split("").map((char, charIndex) => (
          <span
            key={charIndex}
            className={
              wordsToType[currentWordIndex] === word
                ? getCharStyle(char, charIndex)
                : ""
            }
          >
            {char}
          </span>
        ))}{" "}
      </motion.span>
    ));
  }, [input, wordsToType, currentWordIndex]);

  return (
    <div className="flex flex-col items-center mx-auto mt-16">
      <h1 className="text-2xl font-semibold text-white mb-6">Typing Game</h1>

      <div className="mb-4 text-white flex gap-2.5 flex-wrap justify-center">
        {textsType}
      </div>

      <input
        ref={inputRef}
        type="search"
        value={input}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        className="rounded-full p-2 w-full max-w-lg focus:outline-none px-2 font-JetBrainsMono bg-glass text-white"
        disabled={gameOver}
      />

      <div className="mt-6 text-white">
        {showTimer && (
          <div className="text-white font-JetBrainsMono">
            Time Left: {timeLeft}s
          </div>
        )}
        {showWpm && gameOver && (
          <>
            <p className=" font-JetBrainsMono">Words Per Minute: {wpm}</p>
            <p className=" font-JetBrainsMono">Accuracy: {accuracy}%</p>
            <p className="font-JetBrainsMono">
              Correct Characters: {correctCount}
            </p>
            <p className="font-JetBrainsMono">
              Incorrect Characters: {incorrectCount}
            </p>
          </>
        )}
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
