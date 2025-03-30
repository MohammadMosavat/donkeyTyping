import { useState, useEffect, useRef, useMemo, memo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import RecordResult from "../recordResult";
import { ReactSVG } from "react-svg";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface TypingGameProps {
  data: string[];
  time: number;
  showTimer: boolean;
  word: number;
  resetTimer: any;
  regenerateWords: () => void;
}
function TypingGame({
  data,
  time,
  showTimer,
  resetTimer,
  word,
  regenerateWords,
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const focusMode = useSelector((state: RootState) => state.focusMode.value);
  const wordsToType = data;
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
      restartTest();
    }
  }, [resetTimer, time]); // Dependency array to run whenever resetTimer or time changes

  const restartRound = () => {
    setCurrentWordIndex(0);
    // setCharCount(0);
    setInput("");
  };

  const restartTest = () => {
    setTimeLeft(time);
    setWpm(0);
    setAccuracy(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setGameOver(false);
    setTimer(time); // Reset to the original time value
    setHasStarted(false); // Set hasStarted to false so the timer doesn't start
    setCurrentWordIndex(0);
    setCharCount(0);
    setInput("");
  };

  const storeWPM = async () => {
    setLoading(true);
    if (wpm == 0) {
      return;
    }
    const submissionData = {
      username: localStorage.getItem("username"),
      wpm: wpm,
      correct_char: correctChars,
      incorrect_char: incorrectChars,
      date: new Date().toISOString(),
      time: time,
      word: word ?? 0,
      language: "en",
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/store_wpm",
        submissionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
    } catch (error) {
      setLoading(false); // Don't forget to stop loading in case of error
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
      console.log("it is over");
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
    if (
      wordsToType.length - 1 == currentWordIndex &&
      e.target.value.length == currentWord.length
    ) {
      console.log("should restart the test");
    }
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

      // Check if all words are typed
      if (currentWordIndex === wordsToType.length - 1) {
        regenerateWords(); // Call the function from the parent
        restartRound(); // Restart the test after regenerating words
      } else {
        setInput("");
        setCharCount(charCount + 1);
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
      }
    }
  };

  const getWordStyle = (index: number) => {
    return index === currentWordIndex ? "text-thrid underline" : "";
  };

  const getCharStyle = (char: string, index: number) => {
    if (index < input.length) {
      if (focusMode === "on") {
        return "text-primary" ;
      }
      return char === input[index] ? "text-primary" : "text-red-600";
    }
    if (index === input.length) {
      return "relative"; // Needed for absolute positioning of the border animation
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
              {isCurrentWord && charIndex === input.length && (
                <motion.span
                  className="absolute w-full h-full border-r-2 border-primary"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
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

  const timeCounter = useMemo(() => {
    return (
      showTimer && (
        <div className="text-primary text-2xl font-JetBrainsMono">
          {timeLeft}
        </div>
      )
    );
  }, [timeLeft]);

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
            className="[&>div>svg]:size-7 [&_*]:stroke-primary"
          />
          <p>Click here to focus</p>
        </motion.label>
        <section>
          {timeCounter}
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
      {gameOver && !loading && (
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
