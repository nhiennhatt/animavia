import { create } from "zustand";

interface LogHabit {
  habitId: string;
  habitName: string;
  forDate: number;
}

interface UseLogHabit {
  habit: LogHabit | null;
  setLogHabit: (habit: LogHabit | null) => void;
  clearLogHabit: () => void;
}

export const useLogHabit = create<UseLogHabit>((set) => ({
  habit: null,
  setLogHabit: (habit) => set({ habit }),
  clearLogHabit: () => set({ habit: null }),
}));
