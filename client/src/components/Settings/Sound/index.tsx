import Button from "@/components/MainButton";
import { toggleSound } from "@/features/sound/sound";
import { RootState } from "@/store";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const soundOptions = [
  { value: "Off", state: "off" },
  { value: "Kick", state: "kick", file: "/sounds/kick.mp3" },
  { value: "Pick", state: "pick", file: "/sounds/pick.mp3" },
  {
    value: "Mouse",
    state: "mouse-click",
    file: "/sounds/mouse-click.mp3",
  },
  {
    value: "Keyboard",
    state: "keyboard-typing",
    file: "/sounds/keyboard-typing.mp3",
  },
  {
    value: "Camera Shutter",
    state: "camera-shutter",
    file: "/sounds/camera-shutter.mp3",
  },
];

const Sound = () => {
  const dispatch = useDispatch();
  const sound = useSelector((state: RootState) => state.sound.value);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSoundChange = (state: string) => {
    localStorage.setItem("sound", state);
    dispatch(toggleSound(state));

    const selected = soundOptions.find((s) => s.state === sound);
    if (selected?.file) {
      audioRef.current = new Audio(selected.file);
    } else {
      audioRef.current = null;
    }

    if (audioRef.current && sound !== "off") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  return (
    <li className="flex items-center justify-between w-full gap-10">
      <section className="flex flex-col w-2/3 gap-2">
        <p className="text-2xl font-bold">Quick Start</p>
        <p className="text-justify">
          When a user is in the middle of a typing test or has completed a
          session, they can press the Tab key followed by the Enter key to
          immediately restart the test. This eliminates the need to move their
          hands away from the keyboard to use a mouse or trackpad, keeping their
          focus entirely on typing.
        </p>
      </section>
      <ul className="grid grid-cols-3 gap-2 w-1/3">
        {soundOptions.map((option) => (
          <Button
            key={option.state}
            className="!rounded-xl w-full"
            onClick={() => handleSoundChange(option.state)}
            variant={sound === option.state ? "secondary" : "ghost"}
            size="md"
          >
            {option.value}
          </Button>
        ))}
      </ul>
    </li>
  );
};

export default Sound;
