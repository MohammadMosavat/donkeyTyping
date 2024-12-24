"use client";

import React, { useState, useEffect } from "react";

interface TimerType {
  startTime: number;
  handleTimeUpdate: (time: number) => void;
}
export default function Timer({ startTime, handleTimeUpdate }: TimerType) {
  const [time, setTime] = useState(startTime); // Initial countdown value (20 seconds)

  useEffect(() => {
    handleTimeUpdate(time);
    // Exit early if the timer has already reached 0
    if (time <= 0) return;

    // Create an interval to decrement the timer every second
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1); // Decrement time by 1
    }, 1000);

    // Cleanup the interval when the component unmounts or `time` changes
    return () => clearInterval(interval);
  }, [time]); // Dependency ensures this runs when `time` changes

  return (
    <div className="flex text-[#cdcabb] items-center gap-2">
      <h2>{time ?? 0}</h2>
      <h1>Second</h1>
    </div>
  );
}
