import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUser from "./useUser";

const useAuth = () => {
  const router = useRouter();
  const { user } = useUser();
  console.log('this is user' , user);
  useEffect(() => {
    if (!user) {
      router.push("/register/login");
    }
  }, [user, router]);

  return user;
};

export default useAuth;
