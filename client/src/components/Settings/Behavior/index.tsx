import Button from "@/components/MainButton";
import { useDispatch, useSelector } from "react-redux";
import { toggleQuickStart } from "@/features/quickStart/quickStartSlice";
import { RootState } from "@/store";
import { toggleFocusMode } from "@/features/focusMode/focusMode";
import { togglehideExtraElements } from "@/features/hideExtraElements/hideExtraElements";
const Behavior = () => {
  const dispatch = useDispatch();
  const quickStart = useSelector((state: RootState) => state.quickStart.value);
  const focusMode = useSelector((state: RootState) => state.focusMode.value);
  const hideExtraElements = useSelector(
    (state: RootState) => state.hideExtraElements.value
  );
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

  const hideExtraElementsOptions = [
    { value: "off", state: "off" },
    { value: "on", state: "on" },
  ];

  return (
    <ul className="flex flex-col gap-10">
      <li className="flex items-center justify-between w-full gap-10">
        <section className="flex flex-col w-2/3 gap-2">
          <p className="text-2xl font-bold">Quick Start</p>
          <p className="text-justify">
            When a user is in the middle of a typing test or has completed a
            session, they can press the Tab key followed by the Enter key to
            immediately restart the test. This eliminates the need to move their
            hands away from the keyboard to use a mouse or trackpad, keeping
            their focus entirely on typing.
          </p>
        </section>
        <ul className="flex flex-col gap-2 w-1/3">
          {QuickStartOptions.map((option) => {
            return (
              <div key={option.value} className="w-full">
                <Button
                  className="!rounded-xl w-full"
                  onClick={() => {
                    localStorage.setItem("quickStart", option.state);
                    dispatch(toggleQuickStart(option.state));
                  }}
                  variant={quickStart === option.state ? "secondary" : "ghost"}
                  size="md"
                >
                  {option.value}
                </Button>
              </div>
            );
          })}
        </ul>
      </li>
      <li className="flex items-center justify-between w-full gap-10">
        <section className="flex flex-col w-2/3 gap-2">
          <p className="text-2xl font-bold">Focus Mode</p>
          <p className="text-justify">
            Hides error feedback while you type, allowing for a distraction-free
            experience. Unlike regular mode, mistakes aren’t highlighted
            immediately; instead, they are revealed only after the test ends.
            This helps improve speed, muscle memory, and confidence by
            encouraging natural typing without interruptions. Once the test is
            complete, errors, accuracy, and WPM are displayed for review.
          </p>
        </section>
        <ul className="flex flex-col gap-2 w-1/3">
          {FocusModeOptions.map((option) => {
            return (
              <div key={option.value} className="w-full">
                <Button
                  className="!rounded-xl w-full"
                  onClick={() => {
                    localStorage.setItem("focusMode", option.state);
                    dispatch(toggleFocusMode(option.state));
                  }}
                  variant={focusMode === option.state ? "secondary" : "ghost"}
                  size="md"
                >
                  {option.value}
                </Button>
              </div>
            );
          })}
        </ul>
      </li>
      <li className="flex items-center justify-between w-full gap-10">
        <section className="flex flex-col w-2/3 gap-2">
          <p className="text-2xl font-bold">Hide Extra Elements</p>
          <p className="text-justify">
            Hides error feedback while you type, allowing for a distraction-free
            experience. Unlike regular mode, mistakes aren’t highlighted
            immediately; instead, they are revealed only after the test ends.
            This helps improve speed, muscle memory, and confidence by
            encouraging natural typing without interruptions. Once the test is
            complete, errors, accuracy, and WPM are displayed for review.
          </p>
        </section>
        <ul className="flex flex-col gap-2 w-1/3">
          {hideExtraElementsOptions.map((option) => {
            return (
              <div key={option.value} className="w-full">
                <Button
                  className="!rounded-xl w-full"
                  onClick={() => {
                    localStorage.setItem("hideExtraElements", option.state);
                    dispatch(togglehideExtraElements(option.state));
                  }}
                  variant={
                    hideExtraElements === option.state ? "secondary" : "ghost"
                  }
                  size="md"
                >
                  {option.value}
                </Button>
              </div>
            );
          })}
        </ul>
      </li>
    </ul>
  );
};

export default Behavior;
