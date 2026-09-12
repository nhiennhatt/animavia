"use server";

import { protectedHttpClient } from "@/helpers/http-client";
import { HabitValue } from "@/libs/entities/habit-entity";
import { APIResponse } from "@/libs/types/api-response";
import { ServerActionResponse } from "@/libs/types/server-action-response";

export async function getHabitValues(
  habitId: string,
): Promise<ServerActionResponse<HabitValue[]>> {
  const res: APIResponse<HabitValue[]> = await protectedHttpClient(
    "/habit-value",
    {
      params: { habitId },
    },
  );

  return res;
}
