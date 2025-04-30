"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { hashUsername } from "@/utils/hashUsername";
import Cookies from "js-cookie";
import Link from "next/link";
import Button from "@/components/MainButton";

const SignUpForm = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    document.title = "PlanetType | SignUp";
    document.documentElement.className =
      localStorage.getItem("theme") ?? "theme-indigo-emerald";
  });

  const validateFields = () => {
    let isValid = true;

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

    if (!email.trim()) {
      toast.error("Email is required.");
      isValid = false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      toast.error("Invalid email format.");
      isValid = false;
    }

    if (!location.trim()) {
      toast.error("Location is required.");
      isValid = false;
    } else if (location.length < 3) {
      toast.error("Location must be at least 3 characters.");
      isValid = false;
    }

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

      const response = await fetch("http://localhost:5000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, location, password, joinedAt }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Welcome ${username}! Thanks for joining us.`);
        const hashedUsername = await hashUsername(email);
        Cookies.set("hashedUsername", hashedUsername, { expires: 14 });

        router.push("/");
      } else {
        toast.error(data.message || "Failed to sign up.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-[94vh]">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl flex flex-col gap-6 w-96"
      >
        <h2 className="text-2xl font-semibold text-white  font-JetBrainsMono text-center">
          Sign Up
        </h2>
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
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

          <div className="flex flex-col gap-2">
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
        </section>
        <Button variant="outline" type="submit" className="w-full text-primary">
          Sign Up
        </Button>
        <p className="text-center ">
          <Link
            className="text-primary hover:underline font-JetBrainsMono text-center"
            href="/register/login"
          >
            Already have an account? Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
