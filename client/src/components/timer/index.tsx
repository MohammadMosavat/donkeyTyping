"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

interface TimerType {
  startTime: number;
  handleTimeUpdate: (time: number) => void;
}
export default function Timer({ startTime, handleTimeUpdate }: TimerType) {
  const [time, setTime] = useState(startTime);

  useEffect(() => {
    handleTimeUpdate(time);
    if (time <= 0) return;

    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className="flex text-white [&>*]:font-JetBrainsMono items-center gap-2">
      <motion.h2
        key={time}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {time ?? 0}
      </motion.h2>
      <h1>Second</h1>
    </div>
  );
}
