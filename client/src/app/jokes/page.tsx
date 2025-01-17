"use client";
import Loading from "@/components/loading";
import TypingGame from "@/components/Typing";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Joke {
  setup?: string;
  delivery?: string;
  joke?: string;
  error?: boolean;
}

const JokesPage = () => {
  const [data, setData] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJoke = async () => {
    try {
      const response = await fetch("https://v2.jokeapi.dev/joke/Any");
      const data: Joke = await response.json();
      setData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching joke:", error);
      setData({ error: true });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchJoke();
  }, []);

  if (loading) return <Loading />;

  const handleMissionComplete = () => {
    fetchJoke();
    toast("Mission Complete! All words have been typed correctly!");
  };

  return (
    <div className="pt-40 flex flex-col gap-4 w-10/12 mx-auto">
      <img
        className="fixed top-0 left-0 right-0 blur-lg bottom-0 -z-30 scale-110 w-full h-screen"
        src={`${localStorage.getItem("theme") ?? "/images/bg6.jpg"}`}
        alt="Background"
      />
      {data?.setup && (
        <TypingGame
          data={
            (data?.setup + " " + data?.delivery)
              .replace(/[^a-zA-Z0-9\s_-]/g, "")
              .toLowerCase()
              .split(" ") ?? ["hellp"]
          }
          onMissionComplete={handleMissionComplete} // Pass the callback to TypingGame
        />
      )}
    </div>
  );
};

export default JokesPage;
