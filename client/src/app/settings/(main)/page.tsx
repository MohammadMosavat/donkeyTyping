"use client";

import { useState, useEffect } from "react";
import Behavior from "@/components/Settings/Behavior";
import Sound from "@/components/Settings/Sound";
import Button from "@/components/MainButton";
import { useDispatch } from "react-redux";
import { toggleFocusMode } from "@/features/focusMode";
import { toggleHideCapsLock } from "@/features/hideCapsLock";
import { toggleQuickStart } from "@/features/quickStartSlice";
import { toggleSound } from "@/features/sound";
import { togglehideExtraElements } from "@/features/hideExtraElements";
import { motion } from "framer-motion";
import Appearance from "@/components/Settings/Appearance";
import { toggleFontSize } from "@/features/fontSize";

const tabs = [
  { name: "Appearance", content: <Appearance /> },
  { name: "Behavior", content: <Behavior /> },
  { name: "Sound", content: <Sound /> },
];

const SettingsPage = () => {
  const dispatch = useDispatch();
  const handleResetSetting = () => {
    localStorage.setItem("sound", "off");
    localStorage.setItem("focusMode", "off");
    localStorage.setItem("hideCapsLock", "off");
    localStorage.setItem("hideExtraElements", "off");
    localStorage.setItem("quickStart", "off");
    localStorage.setItem("fontSize", "16");
    dispatch(toggleSound("off"));
    dispatch(toggleFocusMode("off"));
    dispatch(toggleHideCapsLock("off"));
    dispatch(togglehideExtraElements("off"));
    dispatch(toggleQuickStart("default"));
    dispatch(toggleFontSize("16"));
  };
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  useEffect(() => {
    document.documentElement.className =
      localStorage.getItem("theme") ?? "theme-indigo-emerald";
  }, []);

  return (
    <div className="flex flex-col w-full items-center gap-10 ">

      <section className="flex w-full justify-between items-center">
        <div className="settings-tabs flex gap-2 border border-primary/30 w-4/12 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              data-active={activeTab === tab.name}
              className={`flex w-1/2 justify-center items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.name
                  ? "bg-primary text-fourth shadow-md"
                  : "text-primary hover:bg-primary/10"
              }`}
            >
              <span className="font-JetBrainsMono">{tab.name}</span>
            </button>
          ))}
        </div>
        <Button
          onClick={handleResetSetting}
          variant="ghost"
          size="md"
          icon="/svgs/logout.svg"
          iconPosition="left"
          className=" !bg-red-600 !text-white hover:!bg-red-800"
        >
          Reset Settings
        </Button>
      </section>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        className="settings-content w-full flex flex-col gap-10 text-primary font-JetBrainsMono"
      >
        {tabs.find((t) => t.name === activeTab)?.content}
      </motion.div>
    </div>
  );
};

export default SettingsPage;
