import { useState } from "react";
import { ReactSVG } from "react-svg";

const SettingBar = ({
  setState,
  num,
  iconUrl,
  title,
}: {
  setState: (state: number) => void;
  num: number[];
  iconUrl: string;
  title: string;
}) => {
  const [activeTime, setActiveTime] = useState(
    title === "Timer"
      ? Number(localStorage.getItem("time")) || 30
      : Number(localStorage.getItem("words")) || 30
  );

  return (
    <div className="flex items-center gap-6">
      <ReactSVG
        data-tooltip={title}
        src={iconUrl}
        className="[&>div>svg]:size-6 font-JetBrainsMono tooltip [&_*]:stroke-primary hover:scale-110 transition-transform duration-200"
      />
      <ul className="flex items-center gap-2 bg-glass/30 p-1.5 rounded-xl">
        {num.map((state) => (
          <li
            key={state}
            onClick={() => {
              if (title === "Timer") {
                localStorage.setItem("time", state.toString());
              } else if (title === "Words") {
                localStorage.setItem("words", state.toString());
              }
              setState(state);
              setActiveTime(state);
            }}
            className={`font-JetBrainsMono min-w-[3rem] text-center cursor-pointer rounded-lg p-2 transition-all duration-200 ease-in-out
              ${
                activeTime === state
                  ? "text-primary"
                  : "text-thrid hover:text-primary"
              }`}
          >
            {state}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingBar;
