import { UserContext } from "@/contexts/user.context";
import { useContext } from "react";

export const useAuthenticated = () => {
  const user = useContext(UserContext);
  if (user.loading) {
    return "idle";
  } else if (user.user) {
    return "authenticated";
  } else {
    return "unauthenticated";
  }
};
