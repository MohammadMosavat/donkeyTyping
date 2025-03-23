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
  const router = useRouter(); // Initialize router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // Fetch all users from the backend
      const response = await axios.get("http://localhost:5000/user");

      if (!response.data || response.data.length === 0) {
        setError("No users found in the database.");
        return;
      }

      // Find user by email
      const user = response.data.find((d) => d.email === email);

      if (!user) {
        setError("User not found. Please check your email.");
        return;
      }

      // Compare entered password with stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        setMessage("Login successful! Redirecting...");
        localStorage.setItem("username", user.username);

        // Redirect to home page after successful login
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-semibold font-JetBrainsMono text-center text-primary mb-8">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="input-group">
            <label className="block font-JetBrainsMono text-primary font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 font-JetBrainsMono text-primary py-2 bg-thrid rounded-xl outline-none "
            />
          </div>
          <div className="input-group">
            <label className="block font-JetBrainsMono text-primary font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 font-JetBrainsMono text-primary py-2 bg-thrid rounded-xl outline-none "
            />
          </div>
          {error && <p className="text-red-600 text-center">{error}</p>}
          {message && <p className="text-green-600 text-center">{message}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-thrid text-white font-semibold rounded-xl"
          >
            Login
          </button>
          <Link
            className="text-primary hover:tracking-[0.2rem] font-JetBrainsMono mt-4 text-center"
            href="/register/signup"
          >
            Sign Up
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
