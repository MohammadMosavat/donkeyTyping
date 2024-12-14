import { useMemo, useState } from "react";

interface NotificationAlertType {
  status: "success" | "error" | "info";
  alertTitle: string;
  className: string;
  alertDesc?: string;
  theme: "dark" | "light";
}
const NotificationAlert = ({
  status,
  alertDesc,
  className,
  alertTitle,
  theme,
}: NotificationAlertType) => {
  const [close, setClose] = useState<boolean>(false);
  const iconsSrc = useMemo(() => {
    if (status == "success") return "/svgs/tick-circle.svg";
    if (status == "error") return "/svgs/close-circle.svg";
    if (status == "info") return "/svgs/info-circle.svg";
  }, []);
  return (
    <div
      className={`${className} ${close && "!-top-32"} ${
        theme == "dark" ? "bg-zinc-400 text-black" : "bg-glass text-white"
      } w-fit mx-auto flex items-center gap-2 transition-all duration-200 ease-in-out p-4 justify-center rounded-xl fixed  left-4 right-4`}
    >
      <section className="flex items-center flex-col gap-4">
        <img src={iconsSrc} alt="" />
        <h1
          className={`${theme == "dark" ? "text-black" : "text-white"} text-sm`}
        >
          {alertTitle}
        </h1>
        <p
          className="text-white text-xs"
          onClick={() => {
            setClose(true);
          }}
        >
          Close
        </p>
      </section>
    </div>
  );
};

export default NotificationAlert;
