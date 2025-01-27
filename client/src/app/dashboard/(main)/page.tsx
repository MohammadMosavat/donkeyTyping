// pages/dashboard.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const username = localStorage.getItem("username");
  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${username}`);
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setUserData(data);
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
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <img
        className="fixed top-0 left-0 right-0 blur-lg bottom-0 -z-30 scale-110 w-full h-screen"
        src={`${localStorage.getItem("theme") ?? "/images/bg6.jpg"}`}
        alt="Background"
      />
      <div className="bg-glass p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">
          User Dashboard
        </h2>

        <div className="mb-4">
          <p className="text-sm font-medium text-white">
            Username: {userData.username}
          </p>
          <p className="text-sm font-medium text-white">
            Email: {userData.email}
          </p>
          <p className="text-sm font-medium text-white">
            Location: {userData.location}
          </p>
          <p className="text-sm font-medium text-white">
            Joined At: {new Date(userData.joinedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
