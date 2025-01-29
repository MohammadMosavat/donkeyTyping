import { hashUsername } from "@/utils/hashUsername";
import { useRouter } from "next/router";

const useAuth = () => {
  const username = localStorage.getItem("username");

  hashUsername(username ?? "").then((hashedUsername) => {
    if (hashedUsername === username) {
      console.log("Match found:", hashedUsername, username);
    } else {
      console.log("No match. Redirecting to signup.", hashedUsername, username);
    }
  }).catch((error) => {
    console.error("Error hashing username:", error);
  });
};

export default useAuth;
