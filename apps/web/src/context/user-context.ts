import { UserEntity } from "@/libs/entities/user-entity";
import { createContext } from "react";

export const UserContext = createContext<UserEntity | null | undefined>(
  undefined,
);
