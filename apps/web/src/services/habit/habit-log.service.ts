"use server";

import z from "zod";
import { protectedHttpClient } from "@/lib/http-client";
import { validateSchemaAsync } from "@/lib/validateSchema";
import { ApiResponse, AppServerResponse } from "@/types/app";
import { HabitLog } from "@/types/entities";
import { logHabitSchema } from "@/validations/habit.validation";

export async function checkLoggedToday(
  habitId: string,
): Promise<AppServerResponse<boolean>> {
  const validation = await validateSchemaAsync(habitId, z.uuid());

  if (!validation.success)
    return {
      ...validation,
      code: "VALIDATION_FAILED",
    };

  const result = await protectedHttpClient(`/habit-log/today`, {
    params: { habitId: validation.data },
  });

  const res: ApiResponse<boolean> = result.data;

  if (res.error)
    return {
      success: false,
      code: res.code,
      error: res.error,
    };

  return {
    success: true,
    code: "SUCCESS",
    data: res.data,
  };
}

export async function getHabitLogs(
  id: string,
  time: number = Math.trunc(new Date().getTime() / 1000),
  period: "w" | "m" = "w",
): Promise<AppServerResponse<HabitLog[]>> {
  const validation = await z.uuid().safeParseAsync(id);

  if (!validation.success)
    return {
      success: false,
      code: "VALIDATION_FAILED",
      error: z.flattenError(validation.error),
    };

  const getResult = await protectedHttpClient.get("/habit-log", {
    params: {
      habit_id: id,
      time,
      period,
    },
  });

  const data: ApiResponse<HabitLog[]> = getResult.data;

  if (data.error)
    return {
      success: false,
      error: data.error,
      code: data.code,
    };

  return { success: true, data: data.data, code: "SUCESS" };
}

export async function logHabit(
  id: string,
  date: number,
  thought?: string,
): Promise<AppServerResponse<HabitLog>> {
  const validation = await logHabitSchema.safeParseAsync({
    habitId: id,
    date,
    thought,
  });

  if (!validation.success)
    return {
      success: false,
      error: z.flattenError(validation.error),
      code: "VALIDATION_FAILED",
    };

  const res: ApiResponse<HabitLog> = await protectedHttpClient.post(
    "/habit-log",
    validation.data,
  );

  if (res.error) {
    return {
      success: false,
      error: res.error,
      code: res.code,
    };
  }

  return {
    success: true,
    code: "SUCCESS",
    data: res.data,
  };
}
