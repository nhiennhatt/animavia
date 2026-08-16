import {
  SteppedCreateHabitSchema,
} from "@/validations/habit.validation";
import { createContext, Dispatch, SetStateAction } from "react";

export const FormDataContext = createContext<
  [
    Partial<SteppedCreateHabitSchema>,
    Dispatch<SetStateAction<Partial<SteppedCreateHabitSchema>>>,
    Partial<Record<keyof SteppedCreateHabitSchema, [string]>>,
  ]
>([
  {},
  () => {
    return (state: Partial<SteppedCreateHabitSchema>) => {};
  },
  {},
]);
