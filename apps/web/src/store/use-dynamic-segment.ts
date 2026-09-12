import { create } from "zustand";

export type DynamicSegment = Record<string, string>;

export type UseDynamicSegment = {
  dynamicSegment: DynamicSegment;
  setDynamicSegment: (s: DynamicSegment) => void;
  isNotFound: boolean;
  setIsNotFound: (i: boolean) => void;
};

export const useDynamicSegment = create<UseDynamicSegment>((set) => ({
  dynamicSegment: {},
  setDynamicSegment: (s) => set({ dynamicSegment: s }),
  isNotFound: false,
  setIsNotFound: (i) => set({ isNotFound: i }),
}));
