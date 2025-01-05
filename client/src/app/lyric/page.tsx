"use client";
import TypingGame from "@/components/Typing";
import Typing from "@/components/Typing";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const LyricsSearch = () => {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    await fetchLyrics(song, artist);
    setLoading(false);
  };

  const fetchLyrics = async (song: string, artist: string) => {
    if (!song || !artist) {
      setError("Song and Artist are required!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Make the GET request to your Flask API to get quotes
      const response = await fetch("http://localhost:5000/songs", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();

        const filterSong = data.map((song: any) => {
          if (
            song.artist.toLowerCase() == artist.toLowerCase() &&
            song.title.toLowerCase() == song.toLowerCase()
          ) {
            return song;
          }
        });
        console.log(filterSong);
      } else {
        toast("Failed to fetch quotes.");
      }
    } catch (error) {
      toast("Error occurred while fetching quotes.");
    } finally {
      setLoading(false); // Stop loading once the request is completed
    }
  };

  const showLyrics = useMemo(() => {
    console.log(
      lyrics
        .toLocaleLowerCase()
        .replace(/[\n,()]/g, "")
        .split(" ")
    );
    return (
      lyrics && (
        <pre className="mt-4 tracking-wider p-4 font-Aspekta w-full bg-glass rounded text-white">
          {lyrics}
        </pre>
      )
    );
  }, [lyrics]);

  const handleMissionComplete = () => {
    toast("Mission Complete! All words have been typed correctly!");
  };

  const showTyping = useMemo(() => {
    console.log(lyrics.toLocaleLowerCase().split(" "));
    return (
      <TypingGame
        data={lyrics
          .toLocaleLowerCase()
          .replace(/\n/g, " ")
          .replace(/\([^)]*\)/g, "")
          .split(" ")}
        onMissionComplete={handleMissionComplete}
      />
    );
  }, [lyrics]);

  return (
    <>
      <div className="flex flex-col items-center  w-10/12 mx-auto text-white ">
        <img
          className="fixed top-0 left-0 right-0 blur-lg bottom-0 -z-30 scale-110 w-full h-screen"
          src={`${localStorage.getItem("theme") ?? "/images/bg6.jpg"}`}
          alt="Background"
        />
        <div className="flex flex-col items-center mt-40 w-full">
          <h1 className="text-3xl font-bold mb-6 font-Aspekta">
            Lyrics Search
          </h1>
          <div className="w-full grid-cols-3 grid gap-4">
            <input
              type="text"
              placeholder="Song"
              value={song}
              onChange={(e) => setSong(e.target.value)}
              className="col-span-full md:col-span-1 p-3 rounded bg-glass font-Aspekta text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <input
              type="text"
              placeholder="Artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="col-span-full md:col-span-1 p-3 rounded bg-glass font-Aspekta text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`col-span-full md:col-span-1 p-3 font-Aspekta rounded bg-glass transition-all duration-200 ease-in-out text-white  ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-2xl hover:drop-shadow-lg"
              }`}
            >
              {loading ? "Searching..." : "Search Lyrics"}
            </button>
          </div>
        </div>
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {/* {showLyrics} */}
      </div>
      <div className=" mb-20 [&>*]:w-full w-full">{showTyping}</div>
    </>
  );
};

export default LyricsSearch;
