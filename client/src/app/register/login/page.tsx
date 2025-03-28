"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import Button from "@/components/MainButton";
import { ReactSVG } from "react-svg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.get("http://localhost:5000/user");

      if (!response.data || response.data.length === 0) {
        toast.error("No users found in the database.");
        return;
      }

      const user = response.data.find((d) => d.email === email);

      if (!user) {
        toast.error("User not found. Please check your email.");
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        toast.success(`Welcome back ${user.username}`);
        localStorage.setItem("username", user.username);

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error("Incorrect password. Please try again.");
      }
    } catch (err) {
      toast.error(
        "An error occurred while logging in. Please try again later."
      );
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    document.documentElement.className =
      localStorage.getItem("theme") ?? "theme-indigo-emerald";
  });

  return (
    <div className="flex justify-center items-center w-full h-[94vh]">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl flex flex-col gap-6 w-96"
      >
        <h2 className="text-2xl font-semibold text-white mb-4 font-JetBrainsMono text-center">
          Login
        </h2>
        <section className="flex flex-col gap-4">
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
          Login
        </Button>

        <p className="text-center">
          <Link
            href="/register/signup"
            className="text-white hover:underline font-JetBrainsMono"
          >
            Don't have an account? Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
