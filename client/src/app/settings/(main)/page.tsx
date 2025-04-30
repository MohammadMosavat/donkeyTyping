"use client";

import { useState, useEffect } from "react";
import Behavior from "@/components/Settings/Behavior";
import Sound from "@/components/Settings/Sound";
import Button from "@/components/MainButton";
import { useDispatch } from "react-redux";
import { toggleFocusMode } from "@/features/focusMode/focusMode";
import { toggleHideCapsLock } from "@/features/hideCapsLock/hideCapsLock";
import { toggleQuickStart } from "@/features/quickStart/quickStartSlice";
import { toggleSound } from "@/features/sound/sound";
import { togglehideExtraElements } from "@/features/hideExtraElements/hideExtraElements";
import { motion } from "framer-motion";

const tabs = [
  { name: "Behavior", content: <Behavior /> },
  { name: "Sound", content: <Sound /> },
  // { name: "Appearance", content: <Appearance /> },
  // { name: "Theme", content: <Theme /> },
  // {
  //   name: "Hide Elements",
  //   content: <hideExtraElements />,
  // },
  // {
  //   name: "Danger Zone",
  //   content: <DangerZone />,
  // },
];

const SettingsPage = () => {
  const dispatch = useDispatch();
  const handleResetSetting = () => {
    localStorage.setItem("sound", "off");
    localStorage.setItem("focusMode", "off");
    localStorage.setItem("hideCapsLock", "off");
    localStorage.setItem("hideExtraElements", "off");
    localStorage.setItem("quickStart", "off");
    dispatch(toggleSound("off"));
    dispatch(toggleFocusMode("off"));
    dispatch(toggleHideCapsLock("off"));
    dispatch(togglehideExtraElements("off"));
    dispatch(toggleQuickStart("default"));
  };
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  useEffect(() => {
    document.documentElement.className =
      localStorage.getItem("theme") ?? "theme-indigo-emerald";
  }, []);

  return (
    <div className="flex flex-col w-full items-center gap-10 ">
      {/* Tabs */}
      <section className="flex w-full justify-between items-center">
        <div className="flex gap-2 bg-thrid w-4/12 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex w-1/2 justify-center items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
                activeTab === tab.name
                  ? "bg-fourth shadow-md"
                  : "hover:bg-primary/5"
              }`}
            >
              <span className="font-JetBrainsMono text-primary">
                {tab.name}
              </span>
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
      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        className="w-full flex flex-col gap-10 text-primary font-JetBrainsMono"
      >
        {tabs.find((t) => t.name === activeTab)?.content}
      </motion.div>
    </div>
  );
};

export default SettingsPage;
