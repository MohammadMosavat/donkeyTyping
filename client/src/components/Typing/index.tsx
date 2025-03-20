import { useState, useEffect, useRef, useMemo, memo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import RecordResult from "../recordResult";
import { ReactSVG } from "react-svg";

interface TypingGameProps {
  data: string[];
  time: number;
  showWpm: boolean;
  bestOf: number;
  showTimer: boolean;
  resetTimer: any;
}
function TypingGame({
  data,
  time,
  showWpm,
  showTimer,
  bestOf,
  resetTimer,
}: TypingGameProps) {
  const [timer, setTimer] = useState(time);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(time);
  const [gameOver, setGameOver] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [id, setID] = useState();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wordsToType = data;

  // New state to track if the game has started
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    setTimeLeft(time);
    setAccuracy(0);
    setWpm(0);
    setCurrentWordIndex(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setCharCount(0);
    setInput("");
  }, [time]);

  useEffect(() => {
    // Reset the timer to the initial value when resetTimer is triggered
    if (resetTimer) {
      setTimeLeft(time);
      setAccuracy(0);
      setWpm(0);
      setCurrentWordIndex(0);
      setCorrectChars(0);
      setIncorrectChars(0);
      setCharCount(0);
      setInput("");
      setTimer(time); // Reset to the original time value
      setHasStarted(false); // Set hasStarted to false so the timer doesn't start
    }
  }, [resetTimer, time]); // Dependency array to run whenever resetTimer or time changes

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
        if (response.ok) {
          setID(data[0]._id);
        }
      } catch (error) {
        console.log("An error occurred while fetching user data.");
      }
    };

    fetchUserData();
  }, []);

  const storeWPM = async () => {
    setLoading(true);
    if (bestOf < wpm) {
      toast.success(`New record ${bestOf}`);
    }
    const submissionData = {
      username: localStorage.getItem("username"),
      id_username: id,
      wpm: wpm,
      correct_char: correctChars,
      incorrect_char: incorrectChars,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      language: "en",
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/store_wpm",
        submissionData
      );
      setLoading(false);
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
    let timerInterval: NodeJS.Timeout;

    if (hasStarted && timeLeft > 0 && !gameOver) {
      timerInterval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameOver(true);
      calculateResults();
    }

    return () => clearInterval(timerInterval);
  }, [timeLeft, gameOver, hasStarted]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        setIsFocused(true);
        inputRef.current.focus();
      }
      if (!hasStarted) {
        setHasStarted(true); // Start the timer when the first key is pressed
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [hasStarted]);

  const calculateResults = () => {
    if (!startTime) return;

    const totalTimeInMinutes = time / 60;

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

    if (!startTime) {
      setStartTime(Date.now());
      setGameOver(false); // Ensure the game restarts
    }

    if (newValue.length < input.length) {
      setInput(newValue);
      setCharCount(charCount + 1); // We still increment char count on backspace
      return;
    }

    setInput(newValue);
    setCharCount(charCount + 1);

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
    return index === currentWordIndex ? "text-thrid underline" : "";
  };

  const getCharStyle = (char: string, index: number) => {
    if (index < input.length) {
      return char === input[index] ? "text-primary" : "text-red-600";
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
          )} font-JetBrainsMono font-extralight text-2xl select-none`}
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
          {isCurrentWord && extraChars.length > 0 && (
            <span className="text-red-600">{extraChars}</span>
          )}
        </motion.span>
      );
    });
  }, [input, wordsToType, currentWordIndex]);

  return (
    <div className="flex flex-col w-full items-center mx-auto ">
      <main className="relative w-full mx-auto">
        <motion.label
          htmlFor="test"
          animate={{ opacity: 1, marginTop: gameOver ? -50 : 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`text-primary font-JetBrainsMono flex items-center justify-center gap-2 w-full h-full place-content-center text-center absolute ${isFocused &&
            "hidden"}`}
        >
          <ReactSVG
            src="/svgs/cursor.svg"
            className="[&>div>svg]:size-6 [&_*]:stroke-primary"
          />
          <p>Click here to focus</p>
        </motion.label>
        <section>
          {showTimer && (
            <div className="text-primary text-2xl font-JetBrainsMono">
              {timeLeft}
            </div>
          )}
          <label
            htmlFor="test"
            className={` ${!isFocused &&
              "blur-sm"} mb-4 text-thrid mx-auto w-full flex gap-2.5 flex-wrap `}
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
      {showWpm && gameOver && !loading && (
        <RecordResult
          isOver={gameOver}
          wpm={wpm}
          corChar={correctChars}
          inChar={incorrectChars}
          acc={accuracy}
        />
      )}
    </div>
  );
}

export default memo(TypingGame);
