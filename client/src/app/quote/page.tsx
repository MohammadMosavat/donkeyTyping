"use client";;
import { useState, useEffect, useCallback } from "react";
import TypingGame from "@/components/Typing";
import Loading from "@/components/loading";
import toast from "react-hot-toast";

const QuotesPage = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // State to store the word check status
  const [wordCheckStatus, setWordCheckStatus] = useState<boolean[]>([]);

  // Function to handle the word check status passed from TypingGame
  const handleWordCheckStatus = (status: boolean[]) => {
    setWordCheckStatus(status); // Update the state with the word check statuses
    console.log("Word check status:", status); // You can handle this data as needed
  };

  const storeQuotes = useCallback(async () => {
    try {
      // Make the POST request to your Flask API to store quotes
      const response = await fetch("http://localhost:5000/store-quotes", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message); // Success message
      } else {
        toast("Failed to store quotes.");
      }
    } catch (error) {
      toast("Error occurred while storing quotes.");
    }
  }, []);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true); // Start loading when fetching data
      storeQuotes();

      try {
        // Make the GET request to your Flask API to get quotes
        const response = await fetch("http://localhost:5000/get-quotes", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          setQuotes(data); // Success message
        } else {
          toast("Failed to fetch quotes.");
        }
      } catch (error) {
        toast("Error occurred while fetching quotes.");
      } finally {
        setLoading(false); // Stop loading once the request is completed
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
      <h1 className="font-JetBrainsMono text-white text-3xl">Quotes</h1>

      {/* Show loading spinner while fetching */}
      {loading ? (
        <Loading />
      ) : (
        <ul className="p-4 text-white rounded-lg flex flex-col items-center">
          {quotes.length > 0 ? (
            quotes.slice(-1).map((quote) => (
              <a
                key={quote.a}
                target="_blank"
                className="underline-offset-4 font-Aspekta underline"
                href={`https://en.wikipedia.org/wiki/${quote.a.replace(
                  " ",
                  "_"
                )}`}
              >
                {quote.a}
              </a>
            ))
          ) : (
            <p className="text-white font-Aspekta">No quotes available.</p>
          )}
          <TypingGame
            data={
              quotes
                .slice(-1)[0]
                ?.q.replace(/[^a-zA-Z0-9\s_-]/g, "")
                .toLowerCase()
                .split(" ") ?? ["hellp"]
            }
            onMissionComplete={handleMissionComplete} // Pass the callback to TypingGame
            showWpm={false}
            showTimer={false}
          />
        </ul>
      )}
    </div>
  );
};

export default QuotesPage;
