"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { getWord } from "@/hooks/randomWord";
import useAuth from "@/hooks/useAuth";
import TypingGame from "@/components/Typing";
import SplitText from "@/components/SplitText";
const Home = () => {
  const [res, setRes] = useState<string[]>([]);
  const [timerKey, setTimerKey] = useState<number>(0); // This will control the timer reset
  const inputRef = useRef<HTMLInputElement | null>(null);
  useAuth();

  // Generate random words on the initial render
  useEffect(() => {
    const randomWord = getWord(40);
    setRes(randomWord);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Function to regenerate words and reset the timer
  const regenerateWords = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const randomWord = getWord(40);
    setRes(randomWord);
    setTimerKey((prev) => prev + 1); // Reset the timer by changing the key
    toast.success("Words refreshed!");
  };

  const handleMissionComplete = () => {
    toast.success("Mission Complete! Generating new words...");
    const randomWord = getWord(40);
    setRes(randomWord);
  };

  const Typing = useCallback(() => {
    return (
      <TypingGame
        data={res} // Pass words to the child component
        onMissionComplete={handleMissionComplete} // Pass the callback
        showWpm={true}
        showTimer={true}
        key={timerKey} // Change key to reset the entire component, including the timer
      />
    );
  }, [res]);
  return (
    <main className="flex flex-col pt-40 items-center justify-center h-screen">
      {/* <SplitText
        text={`Hello, ${localStorage.getItem('username')??'Unknown person'}!`}
        className="text-2xl text-white font-JetBrainsMono font-bold text-center"
        delay={150}
        animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
        animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
        threshold={0.2}
        rootMargin="-50px"
      /> */}
      <form className="flex flex-col mx-auto gap-8 w-11/12 items-center">
        <div className="flex flex-col gap-10 items-start justify-between w-full">
          <div className="flex flex-col items-center gap-4 w-full">
            {Typing()}
            <button
              onClick={regenerateWords}
              className=" hover:opacity-100 opacity-40 !rounded-full"
            >
              <img className="size-6" src="/svgs/refresh.svg" alt="" />
            </button>
          </div>
          <section className="flex justify-between items-start w-full">
            {/* <SettingSection /> */}
            {/* Additional settings or counters can go here */}
          </section>
        </div>
      </form>
    </main>
  );
};

export default Home;
