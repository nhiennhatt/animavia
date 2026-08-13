"use client";

import { BaseUser } from "@/types/user";
import { createContext } from "react";

export const UserContext = createContext<{
  user: BaseUser | null;
  loading: boolean;
}>({ user: null, loading: true });
