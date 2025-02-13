"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Loading from "../loading";
import WpmRecords from "../WpmRecord";
import UserProfileCardProps from "@/types";

export default function UserProfileCard({ username }: { username: string }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UserProfileCardProps>();
  console.log("username in user profile", username);
  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/user?username=${username}`);
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
              <h2 className="text-xl font-Aspekta  text-white">
                @{data.username}
              </h2>
              <p className="text-white text-sm font-Aspekta">{data.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm font-Aspekta text-white">
                Location: {data.location}
              </p>
              <p className="text-sm font-Aspekta text-white">
                Joined At: {new Date(data.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ) : (
          <Loading />
        )}
        <WpmRecords username={username} />
      </div>
    )
  );
}
