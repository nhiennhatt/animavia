"use server";

import { protectedHttpClient } from "@/lib/http-client";
import { validateSchemaAsync } from "@/lib/validateSchema";
import { ApiResponse, AppServerResponse } from "@/types/app";
import { HabitValue } from "@/types/entities";
import z from "zod";

export async function getHabitValues(
  habitId: string,
): Promise<AppServerResponse<HabitValue[]>> {
  const validation = await validateSchemaAsync(habitId, z.uuid());
  if (!validation.success)
    return {
      ...validation,
      code: "VALIDATION_FAILED",
    };

  const result = await protectedHttpClient("/habit-value", {
    params: { habitId },
  });

  const data: ApiResponse<HabitValue[]> = result.data;

  if (data.error) {
    return {
      success: false,
      code: data.code,
      error: data.error,
    };
  }

  return {
    success: true,
    code: "SUCCESS",
    data: data.data,
  };
}
