"use client";

import { useState, useEffect } from "react";
import { ReactSVG } from "react-svg";
import Behavior from "@/components/Settings/Behavior";
import Sound from "@/components/Settings/Sound";
import Appearance from "@/components/Settings/Appearance";
import Theme from "../theme/page";
import HideElements from "@/components/Settings/HideElements";
import DangerZone from "@/components/Settings/DangerZone";
const tabs = [
  { name: "Behavior", content: <Behavior /> },
  // { name: "Sound", content: <Sound /> },
  // { name: "Appearance", content: <Appearance /> },
  // { name: "Theme", content: <Theme /> },
  // {
  //   name: "Hide Elements",
  //   content: <HideElements />,
  // },
  // {
  //   name: "Danger Zone",
  //   content: <DangerZone />,
  // },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  useEffect(() => {
    document.documentElement.className =
      localStorage.getItem("theme") ?? "theme-indigo-emerald";
  }, []);

  return (
    <div className="flex flex-col w-full items-center gap-4 p-6 min-h-screen">
      {/* Tabs */}
      <div className="flex gap-2 bg-thrid w-full p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex w-1/2 justify-center items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
              activeTab === tab.name
                ? "bg-primary/10 shadow-md"
                : "hover:bg-primary/5"
            }`}
          >
            <span className="font-JetBrainsMono text-primary">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="w-full text-primary font-JetBrainsMono">
        {tabs.find((t) => t.name === activeTab)?.content}
      </div>
    </div>
  );
};

export default SettingsPage;
