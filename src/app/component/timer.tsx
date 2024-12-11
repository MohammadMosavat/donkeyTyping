import { useState, useEffect } from "react";

export default function Timer({
  onTimeUpdate,
  startTime,
}: {
  startTime: number;
  onTimeUpdate: (time: number) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(startTime??0); // Timer starts at 60 seconds

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUpdate(timeLeft);
    } // Stop the timer when it reaches 0

    const timer = setInterval(() => {
      timeLeft > 0 && setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [timeLeft]);

  const resetTimer = () => {
    setTimeLeft(60); // Reset timer to 60 seconds
  };

  return (
    <div className="flex flex-col h-fit rounded-2xl items-center justify-center ">
      <div
        className={`text-6xl ${
          timeLeft === 0 ? "text-red-600" : "text-white"
        } `}
      >
        {timeLeft}{" "}
        <span
          className={`${
            timeLeft === 0 ? "text-red-600" : "text-white"
          }  text-base text-white`}
        >
          seconds
        </span>
      </div>
      <button
        onClick={resetTimer}
        className="mt-6 px-6 py-2 bg-zinc-700 text-white rounded-2xl  hover:bg-zinc-500 transition duration-200"
      >
        Reset Timer
      </button>
    </div>
  );
}
