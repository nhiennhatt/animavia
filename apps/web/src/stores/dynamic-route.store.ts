import { UseDynamicRoute } from "@/types/app";
import { create } from "zustand";

export const useDynamicRoute = create<UseDynamicRoute>((set) => ({
  dynamicRoute: {},
  clearDynamicRoute: () => set({ dynamicRoute: {} }),
  setDynamicRoute: (route) => set({ dynamicRoute: route }),
}));
