"use server";

import { protectedHttpClient } from "@/helpers/http-client";
import { HabitLog } from "@/libs/entities/habit-entity";
import { APIResponse } from "@/libs/types/api-response";
import { ServerActionResponse } from "@/libs/types/server-action-response";

export const logHabit = async (
  habitId: string,
  forDate: number,
): Promise<ServerActionResponse<HabitLog | null>> => {
  const res: APIResponse<HabitLog | null> = await protectedHttpClient(
    "/habit-log",
    {
      data: {
        habitId,
        date: forDate,
      },
      method: "POST",
    },
  );

  return res;
};

export const getHabitLog = async (
  habitId: string,
  time: number,
  period: "d" | "w" | "M" = "d",
): Promise<ServerActionResponse<HabitLog[]>> => {
  const res: APIResponse<HabitLog[]> = await protectedHttpClient("/habit-log", {
    params: { habit_id: habitId, period, time },
  });

  return res;
};
