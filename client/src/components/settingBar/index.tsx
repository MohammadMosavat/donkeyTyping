import { useState } from "react";
import { ReactSVG } from "react-svg";

interface SettingBarProps {
  setTime: (time: number) => void;
  setWords: (words: number) => void;
  timeNumbers: number[];
  wordNumbers: number[];
}

const SettingBar = ({
  setTime,
  setWords,
  timeNumbers,
  wordNumbers,
}: SettingBarProps) => {
  const [activeTab, setActiveTab] = useState<"timer" | "words">("timer");
  const [activeTimeNumber, setActiveTimeNumber] = useState<number>(
    localStorage.getItem("time")
      ? parseInt(localStorage.getItem("time")!)
      : 30
  );
  const [activeWordNumber, setActiveWordNumber] = useState<number>(
    localStorage.getItem("words")
      ? parseInt(localStorage.getItem("words")!)
      : 30
  );

  const handleItemClick = (num: number) => {
    if (activeTab === "timer") {
      setActiveTimeNumber(num);
      setTime(num);
      localStorage.setItem("time", num.toString());
    } else {
      setActiveWordNumber(num);
      setWords(num);
      localStorage.setItem("words", num.toString());
    }
  };

  return (
    <div className="flex flex-col w-full items-center gap-4">
      {/* Tabs */}
      <div className="flex gap-2 bg-thrid w-full p-1 rounded-xl">
        <button
          onClick={() => setActiveTab("timer")}
          className={`flex w-1/2 justify-center items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
            activeTab === "timer"
              ? "bg-primary/10 shadow-md"
              : "hover:bg-primary/5"
          }`}
        >
          <ReactSVG
            src="/svgs/timer.svg"
            className="[&>div>svg]:size-5 [&_*]:stroke-primary"
          />
          <span className="font-JetBrainsMono text-primary">Timer</span>
        </button>
        <button
          onClick={() => setActiveTab("words")}
          className={`flex w-1/2 justify-center items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
            activeTab === "words"
              ? "bg-primary/10 shadow-md"
              : "hover:bg-primary/5"
          }`}
        >
          <ReactSVG
            src="/svgs/text.svg"
            className="[&>div>svg]:size-5 [&_*]:stroke-primary"
          />
          <span className="font-JetBrainsMono text-primary">Words</span>
        </button>
      </div>

      {/* Numbers List */}
      <ul className="flex items-center w-full justify-between gap-2 rounded-xl">
        {(activeTab === "timer" ? timeNumbers : wordNumbers).map((num) => (
          <li
            key={num}
            onClick={() => handleItemClick(num)}
            className={`font-JetBrainsMono cursor-pointer p-2 rounded-lg transition-all duration-200 ${
              (activeTab === "timer" ? activeTimeNumber : activeWordNumber) ===
              num
                ? "bg-primary/10 text-primary font-medium shadow-lg shadow-primary/20"
                : "text-thrid hover:bg-thrid hover:text-primary hover:shadow-lg hover:shadow-primary/20"
            }`}
          >
            {num}
            {activeTab === "timer" ? "s" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingBar;
