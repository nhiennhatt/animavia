"use server";

import { protectedHttpClient } from "@/lib/http-client";
import { validateSchemaAsync } from "@/lib/validateSchema";
import { ApiResponse, AppServerResponse } from "@/types/app";
import { HabitBackupPlan } from "@/types/entities";
import z from "zod";

export async function getBackupPlans(
  habitId: string,
): Promise<AppServerResponse<HabitBackupPlan[]>> {
  const validtion = await validateSchemaAsync(habitId, z.uuid());

  if (!validtion.success)
    return {
      ...validtion,
      code: "VALIDATION_FAILED",
    };

  const req = await protectedHttpClient("/backup-plan", {
    params: { habitId },
  });

  const res: ApiResponse<HabitBackupPlan[]> = req.data;

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
