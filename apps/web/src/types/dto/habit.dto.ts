import { Habit, Statement } from "../entities";
import { Nullable } from "../utils";

export interface GetHabitsDto {
  data: (Habit & Nullable<Statement>)[];
  total: number;
}
