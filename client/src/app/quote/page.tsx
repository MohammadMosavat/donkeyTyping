"use client";
import Loading from "@/components/loading";
import { useState, useEffect } from "react";

const QuotesPage = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  const storeQuotes = async () => {
    try {
      // Make the POST request to your Flask API to store quotes
      const response = await fetch("http://localhost:5000/store-quotes", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message); // Success message
      } else {
        setMessage("Failed to store quotes.");
      }
    } catch (error) {
      setMessage("Error occurred while storing quotes.");
    }
  };

  useEffect(() => {
    storeQuotes();
    const fetchQuotes = async () => {
      setLoading(true); // Start loading when fetching data

      try {
        // Make the GET request to your Flask API to get quotes
        const response = await fetch("http://localhost:5000/get-quotes", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          setQuotes(data); // Success message
        } else {
          setMessage("Failed to fetch quotes.");
        }
      } catch (error) {
        setMessage("Error occurred while fetching quotes.");
      } finally {
        setLoading(false); // Stop loading once the request is completed
      }
    };

    // Call fetchQuotes when the component mounts
    fetchQuotes();
  }, []);

  return (
    <div className="absolute flex flex-col gap-4 top-40 left-[20%]">
      <img
        className="fixed top-0 left-0 right-0 blur-lg bottom-0 -z-30 scale-110 w-full h-screen"
        src={`${localStorage.getItem("theme") ?? "/images/bg6.jpg"}`}
        alt="Background"
      />
      <h1 className="font-JetBrainsMono text-white text-3xl">Quotes</h1>

      {/* Show loading spinner while fetching */}
      {loading ? (
        <Loading />
      ) : (
        <ul className="p-4 text-white rounded-lg bg-glass">
          {quotes.length > 0 ? (
            quotes.slice(-1).map((quote, index) => (
              <li
                key={index}
                className="tracking-wider flex items-center gap-1 font-Aspekta"
              >
                "{quote.q}" -
                <a
                target="_blank"
                  className="underline-offset-4 underline"
                  href={`https://en.wikipedia.org/wiki/${quote.a.replace(
                    " ",
                    "_"
                  )}`}
                >
                  {quote.a}
                </a>
              </li>
            ))
          ) : (
            <p className="text-white font-Aspekta">No quotes available.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default QuotesPage;
