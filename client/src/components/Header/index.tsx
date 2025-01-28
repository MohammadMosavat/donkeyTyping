"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../loading";

const Header = () => {
  const username = localStorage.getItem("username");
  const [loading, setLoading] = useState(true);
  const [id, setID] = useState<string>("");
  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/user/${username}`);
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setID(data._id);
        } else {
          toast.error(data.message || "Failed to fetch user data.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <img
        className="fixed top-0 left-0 right-0 blur-lg bottom-0 -z-30 scale-110 w-full h-screen"
        src={`${localStorage.getItem("theme") ?? "/images/bg6.jpg"}`}
        alt="Background"
      />
      <motion.header
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-10/12 bg-glass my-4 z-10 fixed left-[8%] mx-auto flex items-center gap-10 p-2"
      >
        {!loading ? (
          <>
            <Link href={"/"}>
              <img
                src="/svgs/logo.svg"
                title="go home"
                className="w-8 h-8"
                alt=""
              />
            </Link>
            {/* <Link
        href={"/lyric"}
        className="text-white capitalize hover:tracking-wider transition-all ease-in-out duration-200 font-Aspekta"
      >
        Lyrics
      </Link> */}
            <Link
              href={"/quote"}
              className="text-white capitalize hover:tracking-wider transition-all ease-in-out duration-200 font-Aspekta"
            >
              Quotes
            </Link>
            <Link
              href={"/listen-word"}
              className="text-white capitalize hover:tracking-wider transition-all ease-in-out duration-200 font-Aspekta"
            >
              Listen word
            </Link>
            {/* <Link
        href={"/jokes"}
        className="text-white capitalize hover:tracking-wider transition-all ease-in-out duration-200 font-Aspekta"
      >
        Jokes
      </Link> */}
            <Link
              href={`/dashboard/${id}`}
              className="text-white capitalize hover:tracking-wider transition-all ease-in-out duration-200 font-Aspekta"
            >
              dashboard
            </Link>
          </>
        ) : (
          <Loading />
        )}
      </motion.header>
    </>
  );
};

export default Header;
