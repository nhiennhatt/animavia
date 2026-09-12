import { UserContext } from "@/context/user-context";
import { useContext } from "react";

export const useRequiredUser = () => {
  const user = useContext(UserContext);

  if (!user) throw new Error("Feature require authentication");

  return user;
};
