import { SteppedCreateHabitSchema } from "@/validations/habit.validation";
import { createContext, Dispatch, SetStateAction } from "react";

export const FormDataContext = createContext<
  [
    SteppedCreateHabitSchema,
    Dispatch<SetStateAction<SteppedCreateHabitSchema>>,
    Partial<Record<keyof SteppedCreateHabitSchema, [string]>>,
  ]
>([
  {
    name: "",
    domain: [],
    htype: "HTYPE_235",
    weekly: 7,
  },
  () => {
    return (state: Partial<SteppedCreateHabitSchema>) => {};
  },
  {},
]);
