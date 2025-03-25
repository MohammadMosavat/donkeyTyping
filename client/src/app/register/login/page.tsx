"use client";
import React, { useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
        setError("No users found in the database.");
        return;
      }

      const user = response.data.find((d) => d.email === email);

      if (!user) {
        setError("User not found. Please check your email.");
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        setMessage("Login successful! Redirecting...");
        localStorage.setItem("username", user.username);

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while logging in. Please try again later.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="rounded-xl w-96">
        <h2 className="text-2xl font-semibold text-white mb-4 font-JetBrainsMono text-center">
          Login
        </h2>

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

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}

        <button
          type="submit"
          className="w-full bg-glass text-white font-JetBrainsMono py-3 rounded-md"
        >
          Login
        </button>

        <div className="text-center mt-4">
          <Link
            href="/register/signup"
            className="text-white hover:underline font-JetBrainsMono"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
