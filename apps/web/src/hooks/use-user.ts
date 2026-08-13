import { UserContext } from "@/contexts/user.context";
import { useContext } from "react";

export const useUser = () => useContext(UserContext);