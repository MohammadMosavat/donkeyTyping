"use client";
import { useState, useEffect, useCallback } from "react";
import TypingGame from "@/components/Typing";
import Loading from "@/components/loading";
import toast from "react-hot-toast";

const QuotesPage = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [wordCheckStatus, setWordCheckStatus] = useState<boolean[]>([]);

  const handleWordCheckStatus = (status: boolean[]) => {
    setWordCheckStatus(status);
    console.log("Word check status:", status);
  };

  const storeQuotes = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/store-quotes", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      } else {
        toast("Failed to store quotes.");
      }
    } catch (error) {
      toast("Error occurred while storing quotes.");
    }
  }, []);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      storeQuotes();

      try {
        const response = await fetch("http://localhost:5000/get-quotes", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          setQuotes(data);
        } else {
          toast("Failed to fetch quotes.");
        }
      } catch (error) {
        toast("Error occurred while fetching quotes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [message]);

  const handleMissionComplete = () => {
    setMessage("Mission Complete! All words have been typed correctly!");
    toast("Mission Complete! All words have been typed correctly!");
  };

  return (
    <div className="pt-40 flex flex-col gap-4 w-10/12 mx-auto">
      <h1 className="text-5xl font-JetBrainsMono text-[#ffffffb4]">Quotes</h1>


      {loading ? (
        <Loading />
      ) : (
        <ul className="p-4 text-white rounded-xl flex flex-col items-center">
          {quotes.length > 0 ? (
            quotes.slice(-1).map((quote) => (
              <a
                key={quote.a}
                target="_blank"
                className="underline-offset-4 font-JetBrainsMono underline"
                href={`https://en.wikipedia.org/wiki/${quote.a.replace(
                  " ",
                  "_"
                )}`}
              >
                {quote.a}
              </a>
            ))
          ) : (
            <p className="text-white font-JetBrainsMono">
              No quotes available.
            </p>
          )}
          <TypingGame
            data={
              quotes
                .slice(-1)[0]
                ?.q.replace(/[^a-zA-Z0-9\s_-]/g, "")
                .toLowerCase()
                .split(" ") ?? ["hellp"]
            }
            onMissionComplete={handleMissionComplete}
            showWpm={false}
            showTimer={false}
          />
        </ul>
      )}
    </div>
  );
};

export default QuotesPage;
