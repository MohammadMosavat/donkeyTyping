"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Loading from "../loading";
import UserProfileCardProps from "@/types";
import { ReactSVG } from "react-svg";
import { useRouter } from "next/navigation";

export default function UserProfileCard({ username }: { username: string }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UserProfileCardProps>();
  const router = useRouter();

  useEffect(() => {
    document.title = username;
    // Fetch user data from the API
    document.documentElement.className =
      localStorage.getItem("theme") ?? "theme-indigo-emerald";

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/user?username=${username}`
        );
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          console.log("data", data[0]);
          setData(data[0]);
        } else {
          toast.error(data.message || "Failed to fetch user data.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    toast.success("Logged out successfully!");
    router.push("/");
  };

  return (
    data && (
      <div className="flex flex-col gap-5 md:gap-10 w-full">
        {!loading ? (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:justify-between">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
              <h2 className="text-lg md:text-xl font-JetBrainsMono text-primary">
                @{data.username}
              </h2>
              <p className="text-xs md:text-sm font-JetBrainsMono text-primary">
                {data.email}
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              <section
                data-tooltip="Location"
                className="!flex font-JetBrainsMono items-center tooltip gap-2"
              >
                <ReactSVG
                  src="/svgs/location.svg"
                  className="[&>div>svg]:size-5 md:[&>div>svg]:size-7 [&_*]:stroke-primary"
                />
                <p className="text-sm md:text-base font-JetBrainsMono capitalize text-primary">
                  {data.location}
                </p>
              </section>
              <section
                data-tooltip="joined At"
                className="!flex font-JetBrainsMono items-center gap-2 tooltip"
              >
                <ReactSVG
                  src="/svgs/calendar.svg"
                  className="[&>div>svg]:size-5 md:[&>div>svg]:size-7 [&_*]:stroke-primary"
                />
                <p className="text-sm md:text-base font-JetBrainsMono text-primary">
                  {new Date(data.joinedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </section>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 flex items-center gap-2 py-2 md:py-2.5 px-4 md:px-5 rounded-xl transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
              >
                <ReactSVG
                  src="/svgs/logout.svg"
                  className="[&>div>svg]:size-5 md:[&>div>svg]:size-7 [&_*]:stroke-primary"
                />
                <p className="text-sm md:text-base font-JetBrainsMono text-primary">Logout</p>
              </button>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    )
  );
}
