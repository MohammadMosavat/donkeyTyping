"use client";
import { useRef, useState } from "react";
import { faker } from "@faker-js/faker";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const PostRandomWord = () => {
  const [message, setMessage] = useState<string>("");
  const [wordType, setWordType] = useState<string>("noun");
  const [word, setWord] = useState<string>("");
  const [show, setShow] = useState(false);
  const inputRef = useRef(null);
  const postRandomWord = async () => {
    inputRef.current.focus();
    toast("Generating a random word...");
    // Generate a random word using Faker.js
    const randomWord = generateWord(); // You can change this to adjective, verb, etc.
    setWord(randomWord);
    setShow(false);
    try {
      // Make a POST request to the Flask route
      const response = await fetch("http://localhost:5000/post-random-word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word: randomWord }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message); // Show the success message
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to post the word.");
      }
    } catch (error) {
      setMessage("Error occurred while posting the word.");
    }
    sayWord(randomWord);
  };

  const sayWord = (word: string) => {
    if ("speechSynthesis" in window) {
      // Create a new speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(word);

      // Optionally set voice, pitch, and rate
      utterance.pitch = 1; // Normal pitch
      utterance.rate = 1; // Normal speed
      utterance.volume = 1; // Maximum volume

      // Speak the word
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("SpeechSynthesis is not supported in this browser.");
    }
  };

  const generateWord = () => {
    if (wordType === "noun") {
      return faker.word.noun();
    } else if (wordType === "adjective") {
      return faker.word.adjective();
    } else if (wordType === "verb") {
      return faker.word.verb();
    } else {
      return "Invalid type";
    }
  };

  return (
    <div className="flex pt-40 w-3/12 gap-10 mx-auto flex-col items-center p-4">
      <img
        className="fixed top-0 left-0 right-0 blur-lg bottom-0 -z-30 scale-110 w-full h-screen"
        src={`${localStorage.getItem("theme") ?? "/images/bg6.jpg"}`}
        alt="Background"
      />
      <button
        className="bg-glass font-Aspekta text-white py-2 px-4 rounded"
        onClick={postRandomWord}
      >
        Say a word
      </button>

      {word && show && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 textxl font-JetBrainsMono text-white"
        >
          {word}
        </motion.p>
      )}
      <section className="w-full grid grid-cols-4 gap-4 items-center mx-auto">
        <input
          ref={inputRef}
          type="text"
          onChange={(e) => {
            if (e.target.value == word) {
              toast.success("Good Job!");
              postRandomWord();
              e.target.value = "";
            }
          }}
          className="col-span-3 p-4 rounded-xl font-JetBrainsMono text-white bg-glass transition duration-300 focus:outline-none focus:bg-glass "
          placeholder="Type here..."
        />
        <button
          className="bg-glass col-span-1 text-white p-4 font-Aspekta rounded"
          onClick={() => {
            setShow(true);
          }}
        >
          I give up
        </button>
        <button
          className="bg-glass col-span-2 text-white p-4 font-Aspekta rounded"
          onClick={() => {
            sayWord(word);
          }}
        >
          Repeat it
        </button>
        <label className="col-span-2">
          <select
            className="text-white outline-none p-4 rounded bg-glass"
            value={wordType}
            onChange={(e) => setWordType(e.target.value)}
          >
            <option className="text-black bg-transparent" value="noun">
              Noun
            </option>
            <option className="text-black bg-transparent" value="adjective">
              Adjective
            </option>
            <option className="text-black bg-transparent" value="verb">
              Verb
            </option>
          </select>
        </label>
      </section>
    </div>
  );
};

export default PostRandomWord;
