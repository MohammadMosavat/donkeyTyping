import Button from "@/components/MainButton";
import { useDispatch, useSelector } from "react-redux";
import { toggleQuickStart } from "@/features/quickStart/quickStartSlice";
import { RootState } from "@/store";
import { toggleFocusMode } from "@/features/focusMode/focusMode";
const Behavior = () => {
  const dispatch = useDispatch();
  const quickStart = useSelector((state: RootState) => state.quickStart.value);
  const focusMode = useSelector((state: RootState) => state.focusMode.value);
  console.log(quickStart);
  const localQuickStart = localStorage.getItem("quickStart");
  console.log(localQuickStart);

  const QuickStartOptions = [
    { value: "off", state: "off" },
    { value: "esc", state: "esc" },
    { value: "tab + enter", state: "default" },
  ];

  const FocusModeOptions = [
    { value: "off", state: "off" },
    { value: "on", state: "on" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <p>
        Welcome to the Behavior section of the Settings page. Here, you can
        customize the behavior of the app to suit your needs.
      </p>

      <ul className="flex flex-col gap-10">
        <li className="flex items-center justify-between w-full gap-2">
          <section className="flex flex-col w-2/3 gap-2">
            <p className="text-lg font-bold">Quick Start</p>
            <p className="text-sm">
              When a user is in the middle of a typing test or has completed a
              session, they can press the Tab key followed by the Enter key to
              immediately restart the test. This eliminates the need to move
              their hands away from the keyboard to use a mouse or trackpad,
              keeping their focus entirely on typing.
            </p>
          </section>
          <ul className="flex gap-2 w-1/3 justify-center items-center">
            {QuickStartOptions.map((option) => {
              return (
                <div key={option.value}>
                  <Button
                    className="!rounded-xl"
                    onClick={() => {
                      localStorage.setItem("quickStart", option.state);
                      dispatch(toggleQuickStart(option.state));
                    }}
                    variant={
                      quickStart === option.state ? "secondary" : "ghost"
                    }
                    size="sm"
                  >
                    {option.value}
                  </Button>
                </div>
              );
            })}
          </ul>
        </li>
        <li className="flex items-center justify-between w-full gap-2">
          <section className="flex flex-col w-2/3 gap-2">
            <p className="text-lg font-bold">Focus Mode</p>
            <p className="text-sm">
            Hides error feedback while you type, allowing for a distraction-free experience. Unlike regular mode, mistakes aren’t highlighted immediately; instead, they are revealed only after the test ends. This helps improve speed, muscle memory, and confidence by encouraging natural typing without interruptions. Once the test is complete, errors, accuracy, and WPM are displayed for review.
            </p>
          </section>
          <ul className="flex gap-2 w-1/3 justify-center items-center">
            {FocusModeOptions.map((option) => {
              return (
                <div key={option.value}>
                  <Button
                    className="!rounded-xl"
                    onClick={() => {
                      localStorage.setItem("focusMode", option.state);
                      dispatch(toggleFocusMode(option.state));
                    }}
                    variant={
                      focusMode === option.state ? "secondary" : "ghost"
                    }
                    size="sm"
                  >
                    {option.value}
                  </Button>
                </div>
              );
            })}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Behavior;
