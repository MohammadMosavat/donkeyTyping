"use client";
import { useMemo, useState } from "react";

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
      const response = await fetch("http://localhost:5000/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ song, artist }),
      });

      const data = await response.json();

      if (response.ok) {
        setLyrics(data.lyrics);
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Failed to connect to the backend");
    } finally {
      setLoading(false);
    }
  };

  const showLyrics = useMemo(() => {
    return lyrics && <pre>{lyrics}</pre>;
  }, [lyrics]);
  return (
    <div>
      <input
        type="text"
        placeholder="Song"
        value={song}
        onChange={(e) => setSong(e.target.value)}
      />
      <input
        type="text"
        placeholder="Artist"
        value={artist}
        onChange={(e) => setArtist(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search Lyrics"}
      </button>
      {error && <p>Error: {error}</p>}
      {showLyrics}
    </div>
  );
};

export default LyricsSearch;
