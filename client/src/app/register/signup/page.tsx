"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { hashUsername } from "@/utils/hashUsername";
import Cookies from "js-cookie";

const SignUpForm = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>(""); // New email field state
  const [location, setLocation] = useState<string>("");
  const router = useRouter(); // Initialize the router

  const validateFields = () => {
    let isValid = true;

    // Validate username (e.g., minimum 3 characters, no special characters)
    if (!username.trim()) {
      toast.error("Username is required.");
      isValid = false;
    } else if (username.length < 3) {
      toast.error("Username must be at least 3 characters.");
      isValid = false;
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
      toast.error("Username can only contain letters and numbers.");
      isValid = false;
    }

    // Validate email (e.g., proper email format)
    if (!email.trim()) {
      toast.error("Email is required.");
      isValid = false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      toast.error("Invalid email format.");
      isValid = false;
    }

    // Validate location (e.g., minimum 3 characters)
    if (!location.trim()) {
      toast.error("Location is required.");
      isValid = false;
    } else if (location.length < 3) {
      toast.error("Location must be at least 3 characters.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields before making the API call
    const isValid = validateFields();
    if (!isValid) {
      return;
    }
    try {
      const joinedAt = new Date().toISOString();
      const response = await fetch("http://localhost:5000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, location, joinedAt }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        localStorage.setItem("username", username);
        hashUsername(email).then((hashedUsername) => {
          Cookies.set("hashedUsername", hashedUsername, { expires: 14 });
          console.log("Hashed Username saved in cookie:", hashedUsername);
        });
        router.push("/");
      } else {
        toast.error(data.message || "Failed to sign up.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const getThemeFromLocal = localStorage.getItem("theme");

  return (
    <div className="flex justify-center items-center min-h-screen">
      <img
        className="fixed top-0 left-0 right-0 blur-lg bottom-0 -z-30 scale-110 w-full h-screen"
        src={getThemeFromLocal ?? "/images/bg2.jpg.jpg.png"}
        alt="Background"
      />
      <form
        onSubmit={handleSubmit}
        className="bg-glass p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-semibold text-white mb-4 font-Aspekta text-center">
          Sign Up
        </h2>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-Aspekta font-medium text-white"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mt-1 outline-none bg-glass font-Aspekta text-white rounded-md"
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium font-Aspekta text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mt-1 outline-none bg-glass font-Aspekta text-white rounded-md"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-sm font-medium font-Aspekta text-white"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 mt-1 outline-none bg-glass font-Aspekta text-white rounded-md"
            placeholder="Enter your location"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-glass text-white font-Aspekta py-3 rounded-md mt-4"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
