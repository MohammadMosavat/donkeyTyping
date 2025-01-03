"use client";
import { useState, useEffect } from "react";

const QuotesPage = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        // Make the GET request to your Flask API
        const response = await fetch("http://localhost:5000/get-quotes");

        if (response.ok) {
          const data = await response.json();
          setQuotes(data); // Set the quotes to the state
        } else {
          setMessage("Failed to fetch quotes from the server.");
        }
      } catch (error) {
        setMessage("Error occurred while fetching quotes.");
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
      {message && <p>{message}</p>}
      <ul className="p-4 text-white rounded-lg bg-glass">
        {quotes.length > 0 ? (
          quotes.map((quote, index) => (
            <li key={index} className="tracking-wider font-Aspekta">
              {index + 1}- "{quote.q}" - {quote.a}
            </li>
          ))
        ) : (
          <p>No quotes available.</p>
        )}
      </ul>
    </div>
  );
};

export default QuotesPage;
