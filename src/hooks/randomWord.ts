"use client";
import { useState, useEffect } from "react";

export default function RandomWord(length: number, number: number) {
  const [word, setWord] = useState("");

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(
          `https://random-word-api.herokuapp.com/word?number=${number}`
        );
        const data = await response.json();
        const filteredWords = data.filter(
          (word: string) => word.length <= length
        );
        setWord(filteredWords); // The API returns an array of data
      } catch (error) {
        console.error("Error fetching the word:", error);
      }
    };

    fetchWord();
  }, []);

  return word;
}
