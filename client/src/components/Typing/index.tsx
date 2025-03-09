import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";

interface TypingGameProps {
  data: string[];
  onMissionComplete: () => void;
  showWpm: boolean;
  bestOf: number;
  showTimer: boolean;
  keyUniqe?: number;
}

export default function TypingGame({
  data,
  onMissionComplete,
  showWpm,
  showTimer,
  bestOf,
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
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [id, setID] = useState();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wordsToType = data;

  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/user?username=${localStorage.getItem(
            "username"
          )}`
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          console.log("data", data);
          setID(data[0]._id);
        }
      } catch (error) {
        console.log("An error occurred while fetching user data.");
      }
    };

    fetchUserData();
  }, []);

  const storeWPM = async () => {
    console.log(id);
    if (bestOf < wpm) {
      toast.success(`New record ${bestOf}`);
    }
    const submissionData = {
      username: localStorage.getItem("username"),
      id_username: id,
      wpm: wpm,
      correct_char: correctChars,
      incorrect_char: incorrectChars,
      date: new Date().toUTCString(),
      language: "en",
    };

    console.log("Submitting data:", submissionData);

    try {
      const response = await axios.post(
        "http://localhost:5000/store_wpm",
        submissionData
      );
      console.log(response.data);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
    setIsFocused(true);
  }, []);

  useEffect(() => {
    if (gameOver) {
      storeWPM();
    }
  }, [gameOver]);
  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (timeLeft > 0 && !gameOver) {
        isFocused && setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      } else {
        setGameOver(true);
        calculateResults();
        // if (gameOver && onMissionComplete) onMissionComplete();
      }
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [timeLeft, gameOver, isFocused]);

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

    const totalTimeInMinutes = 30 / 60;

    // Calculate WPM based on entire text input
    const wpmCalc = Math.round(charCount / (5 * totalTimeInMinutes));
    setWpm(wpmCalc);

    // Calculate accuracy based on correct and incorrect characters
    const totalChars = correctChars + incorrectChars;
    const accuracyCalc =
      totalChars === 0 ? 100 : Math.round((correctChars / totalChars) * 100);
    setAccuracy(accuracyCalc);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // If backspace is pressed (newValue is shorter than the previous input), do not update the counters
    if (newValue.length < input.length) {
      setInput(newValue);
      setCharCount(charCount + 1); // We still increment char count on backspace
      return;
    }

    setInput(newValue);
    setCharCount(charCount + 1);

    if (!startTime) {
      setStartTime(Date.now());
    }

    // Update correct and incorrect characters only for added characters, not for backspace
    const currentWord = wordsToType[currentWordIndex];
    const inputChar = newValue[newValue.length - 1];

    if (inputChar === currentWord[newValue.length - 1]) {
      setCorrectChars(correctChars + 1);
    } else {
      setIncorrectChars(incorrectChars + 1);
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
        <section>
          {showTimer && (
            <div className="text-white text-xl font-JetBrainsMono">
              {timeLeft}
            </div>
          )}
          <label
            htmlFor="test"
            className={` ${!isFocused &&
              "blur-sm"} mb-4 text-white mx-auto w-full flex gap-2.5 flex-wrap `}
          >
            {textsType}
          </label>
        </section>
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
        {showWpm && gameOver && (
          <>
            <p className="font-JetBrainsMono">Words Per Minute: {wpm}</p>
            <p className="font-JetBrainsMono">Accuracy: {accuracy}%</p>

            {/* Display correct and incorrect characters */}
            <p className="font-JetBrainsMono">
              Correct Characters: {correctChars}
            </p>
            <p className="font-JetBrainsMono">
              Incorrect Characters: {incorrectChars}
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
