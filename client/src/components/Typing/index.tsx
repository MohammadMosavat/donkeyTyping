"use client";
import { useState, useEffect } from "react";

const TypingGame = ({
  data,
  onMissionComplete,
}: {
  data: string[];
  onMissionComplete: () => void;
}) => {
  const initialTime = 120;
  const [input, setInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordStatus, setWordStatus] = useState<boolean[]>([]);
  const [timer, setTimer] = useState<number>(initialTime); // Timer in seconds (2 minutes)
  const [isDisabled, setIsDisabled] = useState<boolean>(false); // To disable the input
  const [completedWords, setCompletedWords] = useState<number>(0); // To track correct words typed
  const [wpm, setWpm] = useState<number>(0); // Words per minute
  const targetWord = data[currentWordIndex];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isDisabled) {
      setInput(e.target.value);
    }
  };

  const getLetterStyles = (letter: string, index: number) => {
    if (input[index] === letter) {
      return { color: "green" };
    } else if (input[index] !== undefined) {
      return { color: "red" };
    }
    return {};
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

    if (isCorrect) {
      setCompletedWords((prev) => prev + 1);
    }

    if (currentWordIndex + 1 == data.length) {
      onMissionComplete();
    }
  };

  const isLastWordComplete = input === targetWord;

  useEffect(() => {
    if (input.length === targetWord?.length) {
      handleCompleteWord();
    }
  }, [input]);

  // Timer functionality
  useEffect(() => {
    if (timer === 0) {
      setIsDisabled(true); // Disable input when time is up
    }
  }, [timer]);

  useEffect(() => {
    if (isDisabled) return;

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
  }, [isDisabled]);

  // Calculate WPM when time is up
  useEffect(() => {
    if (timer === 0) {
      const minutes = initialTime / 60;
      setWpm(Math.floor(completedWords / minutes));
    }
  }, [completedWords, timer]);

  return (
    <div className="flex flex-col items-center pt-8 px-4 sm:px-8 md:px-16">
      <div className="font-Aspekta mb-6">
        <div className="flex flex-wrap justify-center gap-2 text-white">
          {data.map((word, wordIndex) => {
            // Check if the current word is active or not
            const isActiveWord = wordIndex === currentWordIndex;
            return (
              <div key={wordIndex} className="flex items-center">
                {/* Apply lower opacity for non-active words */}
                <div
                  className={`flex items-center ${!isActiveWord ? "opacity-40" : ""}`}
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
                        className={`${isActive && "underline-offset-4"} transition-all duration-200 ease-in-out text-lg sm:text-xl text-white`}
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
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Start typing..."
        className="p-4 mb-4 placeholder:text-white placeholder:opacity-40 text-white bg-glass font-Aspekta bg-glass outline-none rounded-lg w-full sm:w-80 md:w-96"
        disabled={isDisabled}
      />

      <div className="mt-4 text-white font-Aspekta">
        {isLastWordComplete
          ? "Last word is complete!"
          : "Keep typing the last word..."}
      </div>

      <div className="mt-4 text-white font-Aspekta">
        {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
      </div>

      {wpm ? (
        <div className="mt-4 text-white font-Aspekta">
          Words per minute: {wpm}
        </div>
      ) : null}
    </div>
  );
};

export default TypingGame;
