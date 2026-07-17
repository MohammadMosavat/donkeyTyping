import UserProfileCardProps from "@/types";
import { useState, useEffect } from "react";
import backendApi from "@/api/backend";

const useUser = () => {
  const [user, setUser] = useState<UserProfileCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | unknown>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) {
          setUser([]);
          return;
        }
        const response = await backendApi.get("/users", {
          params: { username },
        });
        setUser(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error };
};

export default useUser;
