"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Loading from "../loading";
import UserProfileCardProps from "@/types";
import { ReactSVG } from "react-svg";

export default function UserProfileCard({ username }: { username: string }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UserProfileCardProps>();
  useEffect(() => {
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

  return (
    data && (
      <div className="flex flex-col gap-10 w-full">
        {!loading ? (
          <div className="flex items-center gap-4 justify-between">
            <div className="flex gap-4 items-center">
              <h2 className="text-xl font-JetBrainsMono  text-primary">
                @{data.username}
              </h2>
              <p className="text-primary text-sm font-JetBrainsMono">
                {data.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <section data-tooltip="Location" className="!flex font-JetBrainsMono items-center tooltip gap-2">
                <ReactSVG
                  src="/svgs/location.svg"
                  className="[&>div>svg]:size-6 [&_*]:stroke-primary"
                />
                <p className="font-JetBrainsMono capitalizetext text-primary">
                  {data.location}
                </p>
              </section>
              <section data-tooltip="joined At" className="!flex font-JetBrainsMono items-center gap-2 tooltip">
                <ReactSVG
                  src="/svgs/calendar.svg"
                  className="[&>div>svg]:size-6  [&_*]:stroke-primary"
                />
                <p className="font-JetBrainsMono text-primary">
                  {new Date(data.joinedAt).toLocaleDateString()}
                </p>
              </section>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    )
  );
}
