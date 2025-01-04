"use client";
import { useState, useEffect } from "react";

const TypingGame = ({
  data,
  onMissionComplete,
}: {
  data: string[];
  onMissionComplete: () => void;
}) => {
  const [input, setInput] = useState(""); // State to hold the user's input
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // To track which word the user is typing
  const [wordStatus, setWordStatus] = useState<boolean[]>([]); // Track the correctness of each word
  const targetWord = data[currentWordIndex]; // Current word based on the index

  // Function to handle changes in the input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Function to get the styles for the letters based on correctness
  const getLetterStyles = (letter: string, index: number) => {
    if (input[index] === letter) {
      return { color: "green" }; // Correct letter
    } else if (input[index] !== undefined) {
      return { color: "red" }; // Incorrect letter
    }
    return {}; // Default style (before the user types anything)
  };

  // Handle when the user completes typing the current word
  const handleCompleteWord = () => {
    const isCorrect = input === targetWord; // Check if the word is correct
    setWordStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[currentWordIndex] = isCorrect; // Update the status for the current word
      return newStatus;
    });

    setCurrentWordIndex((prev) => prev + 1); // Move to the next word
    setInput(""); // Clear the input for the next word

    console.log(wordStatus);
    // Check if all words are completed
    console.log(currentWordIndex + 1, data.length);
    if (currentWordIndex + 1 == data.length) {
      onMissionComplete(); // Trigger the mission complete alert
    }
  };

  // Check if the last word is complete
  const isLastWordComplete = input === targetWord; // Check if the input matches the target word

  useEffect(() => {
    if (input.length === targetWord?.length) {
      handleCompleteWord(); // Move to next word if length matches, regardless of correctness
    }
  }, [input]); // Trigger the check when the input changes

  return (
    <div className="flex flex-col items-center pt-8 px-4 sm:px-8 md:px-16">
      <div className="font-Aspekta mb-6">
        {/* Display all words in the data array */}
        <div className="flex flex-wrap justify-center gap-2 text-white">
          {data.map((word, wordIndex) => {
            return (
              <div key={wordIndex} className="flex items-center ">
                {word.split("").map((letter, letterIndex) => {
                  const isActive =
                    wordIndex === currentWordIndex &&
                    letterIndex === input.length; // Mark the active character
                  const isCompleted =
                    wordIndex < currentWordIndex ||
                    (wordIndex === currentWordIndex &&
                      input.length === word.length); // Check if the word is completed
                  const isChecking = wordIndex === currentWordIndex; // Check if it's the active word being typed

                  return (
                    <span
                      key={letterIndex}
                      className={`${isActive &&
                        "underline-offset-4"} text-lg sm:text-xl text-white`}
                      style={{
                        ...getLetterStyles(letter, letterIndex),
                        textDecoration: isActive ? "underline" : "none", // Add underline to active character
                        color: isCompleted
                          ? "white"
                          : isChecking
                          ? getLetterStyles(letter, letterIndex).color
                          : "white", // Apply red to the entire word if incorrect
                      }}
                    >
                      {letter}
                    </span>
                  );
                })}
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
        className="p-4 mb-4  text-white bg-glass font-Aspekta bg-glass outline-none rounded-lg w-full sm:w-80 md:w-96"
      />

      {/* Display message based on whether the last word is complete */}
      <div className="mt-4 text-white font-Aspekta">
        {isLastWordComplete
          ? "Last word is complete!"
          : "Keep typing the last word..."}
      </div>
    </div>
  );
};

export default TypingGame;
