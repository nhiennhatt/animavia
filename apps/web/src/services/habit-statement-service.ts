"use server";

import { protectedHttpClient } from "@/helpers/http-client";
import { HabitStatement } from "@/libs/entities/habit-entity";
import { APIResponse } from "@/libs/types/api-response";
import { ServerActionResponse } from "@/libs/types/server-action-response";

export async function getHabitStatement(params: {
  habitId: string;
  page?: number;
  pageSize?: number;
  random?: 0 | 1;
}): Promise<ServerActionResponse<HabitStatement[]>> {
  const res: APIResponse<HabitStatement[]> = await protectedHttpClient(
    "/statement",
    {
      params,
    },
  );

  return res;
}
