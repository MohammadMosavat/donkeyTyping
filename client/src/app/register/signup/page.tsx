"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { hashUsername } from "@/utils/hashUsername";
import Cookies from "js-cookie";

const SignUpForm = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const validateFields = () => {
    let isValid = true;

    // Validate username
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

    // Validate email
    if (!email.trim()) {
      toast.error("Email is required.");
      isValid = false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      toast.error("Invalid email format.");
      isValid = false;
    }

    // Validate location
    if (!location.trim()) {
      toast.error("Location is required.");
      isValid = false;
    } else if (location.length < 3) {
      toast.error("Location must be at least 3 characters.");
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      toast.error("Password is required.");
      isValid = false;
    } else if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateFields();
    if (!isValid) {
      return;
    }
    try {
      const joinedAt = new Date().toISOString();
      
      // Register user
      const response = await fetch("http://localhost:5000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, location, password, joinedAt }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // // Send welcome email
        // const emailResponse = await fetch("http://localhost:5000/send-welcome-email", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     email,
        //     username
        //   }),
        // });

        // if (!emailResponse.ok) {
        //   console.error("Failed to send welcome email");
        // }

        // Show welcome message
        toast.success(`Welcome ${username}! Thanks for joining us.`);
        
        // Set username in localStorage after successful registration
        localStorage.setItem("username", username);
        
        // Hash username and set cookie
        const hashedUsername = await hashUsername(email);
        Cookies.set("hashedUsername", hashedUsername, { expires: 14 });
        
        router.push("/");
      } else {
        // Show specific error message from backend
        toast.error(data.message || "Failed to sign up.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-white mb-4 font-JetBrainsMono text-center">
          Sign Up
        </h2>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-JetBrainsMono font-medium text-white"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mt-1 outline-none bg-glass font-JetBrainsMono text-white rounded-md"
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium font-JetBrainsMono text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mt-1 outline-none bg-glass font-JetBrainsMono text-white rounded-md"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-sm font-medium font-JetBrainsMono text-white"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 mt-1 outline-none bg-glass font-JetBrainsMono text-white rounded-md"
            placeholder="Enter your location"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium font-JetBrainsMono text-white"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mt-1 outline-none bg-glass font-JetBrainsMono text-white rounded-md"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-glass text-white font-JetBrainsMono py-3 rounded-md mt-4"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
