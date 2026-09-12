"use server";

import { protectedHttpClient } from "@/helpers/http-client";
import { HabitBackupPlan } from "@/libs/entities/habit-entity";
import { APIResponse } from "@/libs/types/api-response";
import { ServerActionResponse } from "@/libs/types/server-action-response";

export async function getHabitBackupPlan(
  habitId: string,
): Promise<ServerActionResponse<HabitBackupPlan[]>> {
  const res: APIResponse<HabitBackupPlan[]> = await protectedHttpClient(
    "/backup-plan",
    {
      params: { habitId },
    },
  );

  return res;
}
