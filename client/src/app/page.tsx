"use client";;
import { useLayoutEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { getWord } from "@/hooks/randomWord";
import TypingGame from "@/components/Typing";
import SettingSection from "@/components/SettingSection";

const Home = () => {
  const [res, setRes] = useState<string[]>([]); // Words for the game
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  // Generate random words on the initial render
  useLayoutEffect(() => {
    regenerateWords();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Function to regenerate words
  const regenerateWords = () => {
    const randomWord = getWord(40); // Adjust the number of words as needed
    setRes(randomWord);
  };

  // Handle mission completion
  const handleMissionComplete = () => {
    toast.success("Mission Complete! Generating new words...");
    regenerateWords(); // Regenerate words when the mission is complete
  };

  return (
    <main className="flex pt-40 items-center justify-center h-screen">
      <form className="flex flex-col mx-auto gap-8 w-11/12 items-center">
        <div className="flex flex-col gap-10 items-start justify-between w-full">
          <TypingGame
            data={res} // Pass words to the child component
            onMissionComplete={handleMissionComplete} // Pass the callback
            showWpm={true}
            showTimer={true}
          />
          <section className="flex justify-between items-start w-full">
            <SettingSection />
            {/* Additional settings or counters can go here */}
          </section>
        </div>
      </form>
    </main>
  );
};

export default Home;
