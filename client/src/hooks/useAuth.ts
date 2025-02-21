import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const router = useRouter();
  const username = localStorage.getItem("username") ?? null;
  useEffect(() => {
    if (!username) {
      router.push("/register/signup"); // Navigate after render
    }
  }, [username, router]); // Runs when `username` changes

  return username; // Or any other authentication-related data
};

export default useAuth;
