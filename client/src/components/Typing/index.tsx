"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";

interface FormData {
  username: string | null;
  id_username: string;
  wpm: number | "";
  correct_char: number | "";
  incorrect_char: number | "";
  date: string;
  language: string;
}

const TypingGame = ({
  data,
  onMissionComplete,
  showWpm,
  showTimer,
}: {
  data: string[];
  onMissionComplete: () => void;
  showWpm: boolean;
  showTimer: boolean;
}) => {
  const initialTime = 20;
  const [input, setInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordStatus, setWordStatus] = useState<boolean[]>([]);
  const [timer, setTimer] = useState<number>(initialTime);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [totalWordsTyped, setTotalWordsTyped] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [incorrectChars, setIncorrectChars] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const targetWord = data[currentWordIndex];
  const [id, setID] = useState();

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/user/${localStorage.getItem("username")}`
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          console.log("data", data);
          setID(data._id);
        }
      } catch (error) {
        console.log("An error occurred while fetching user data.");
      }
    };

    fetchUserData();
  }, []);

  // Handle form submission
  const handleSubmit = async () => {
    setMessage(null);
    console.log(id);
    const submissionData = {
      username: localStorage.getItem("username"),
      id_username: id,
      wpm: wpm,
      correct_char: correctChars,
      incorrect_char: incorrectChars,
      date: new Date().toISOString(),
      language: "en",
    };

    console.log("Submitting data:", submissionData);

    try {
      const response = await axios.post(
        "http://localhost:5000/store_wpm",
        submissionData
      );
      setMessage({ type: "success", text: response.data.message });
    } catch (error) {
      console.error("Submission error:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Something went wrong!",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isDisabled) {
      setInput(e.target.value);
    }
  };

  const handleInputFocus = () => {
    if (!isTimerActive) {
      setIsTimerActive(true);
    }
  };

  const handleCompleteWord = () => {
    const isCorrect = input === targetWord;

    setWordStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[currentWordIndex] = isCorrect;
      return newStatus;
    });

    setCurrentWordIndex((prev) => prev + 1);
    setInput("");

    setTotalWordsTyped((prev) => prev + 1);

    if (currentWordIndex + 1 === data.length) {
      onMissionComplete();
    }

    // Calculate correct and incorrect characters after the word is completed
    calculateCorrectAndIncorrectChars();
  };

  const calculateCorrectAndIncorrectChars = () => {
    let correctCount = 0;
    let incorrectCount = 0;

    // Calculate the correct and incorrect characters based on input and target word
    for (let i = 0; i < targetWord.length; i++) {
      if (input[i] === targetWord[i]) {
        correctCount++;
      } else if (input[i] !== undefined) {
        incorrectCount++;
      }
    }

    // Update the correct and incorrect chars state without resetting them
    setCorrectChars((prevCorrect) => prevCorrect + correctCount);
    setIncorrectChars((prevIncorrect) => prevIncorrect + incorrectCount);
  };

  useEffect(() => {
    if (input.length === targetWord?.length) {
      handleCompleteWord();
    }
    const minutes = initialTime / 60;
    setWpm(Math.floor(totalWordsTyped / minutes));
  }, [input]);

  useEffect(() => {
    if (timer === 0) {
      setIsDisabled(true);

      const minutes = initialTime / 60;
      setWpm(Math.floor(totalWordsTyped / minutes));
      handleSubmit();
    }
  }, [timer, totalWordsTyped]);

  useEffect(() => {
    if (!isTimerActive || isDisabled) return;

    const intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isTimerActive, isDisabled]);

  useEffect(() => {
    setInput("");
    setCurrentWordIndex(0);
    setWordStatus([]);
  }, [data]);

  // Function to determine the letter styles (color) for each character
  const getLetterStyles = (letter: string, index: number) => {
    if (input[index] === letter) {
      return { color: "green" }; // Correct character
    } else if (input[index] !== undefined) {
      return { color: "red" }; // Incorrect character
    }
    return {};
  };

  return (
    <div className="flex flex-col items-center pt-8 px-4 sm:px-8 md:px-16">
      <div className="font-Aspekta mb-6">
        <div className="flex flex-wrap justify-center gap-2 text-white">
          {data.map((word, wordIndex) => {
            const isActiveWord = wordIndex === currentWordIndex;
            return (
              <div key={wordIndex} className="flex items-center">
                <div
                  className={`flex items-center ${
                    !isActiveWord ? "opacity-40" : ""
                  }`}
                >
                  {word.split("").map((letter, letterIndex) => {
                    const isActive =
                      wordIndex === currentWordIndex &&
                      letterIndex === input.length;
                    const isCompleted =
                      wordIndex < currentWordIndex ||
                      (wordIndex === currentWordIndex &&
                        input.length === word.length);
                    const isChecking = wordIndex === currentWordIndex;

                    return (
                      <span
                        key={letterIndex}
                        className={`${isActive &&
                          "underline-offset-4"} transition-all duration-200 ease-in-out text-lg sm:text-xl text-white`}
                        style={{
                          ...getLetterStyles(letter, letterIndex),
                          textDecoration: isActive ? "underline" : "none",
                          color: isCompleted
                            ? "white"
                            : isChecking
                            ? getLetterStyles(letter, letterIndex).color
                            : "white",
                        }}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder="Start typing..."
        className="p-4 mb-4 placeholder:text-white placeholder:opacity-40 text-white font-Aspekta bg-glass outline-none rounded-lg w-full sm:w-80 md:w-96"
        disabled={isDisabled}
      />

      {showTimer && (
        <p className="mt-4 text-white font-Aspekta">
          {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
        </p>
      )}

      {showWpm && timer === 0 ? (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex mt-4 flex-col gap-2"
        >
          <div className=" text-white font-Aspekta">
            Words per minute: {wpm}
          </div>

          <div className="text-white font-Aspekta">
            Correct characters: {correctChars}
          </div>
          <div className="text-white font-Aspekta">
            Incorrect characters: {incorrectChars}
          </div>
        </motion.section>
      ) : null}
    </div>
  );
};

export default TypingGame;
