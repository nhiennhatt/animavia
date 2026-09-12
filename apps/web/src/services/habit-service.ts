"use server";

import { HabitTypeEnum } from "@/helpers/contants/app";
import { protectedHttpClient } from "@/helpers/http-client";
import { Habit } from "@/libs/entities/habit-entity";
import { APIResponse } from "@/libs/types/api-response";
import { ServerActionResponse } from "@/libs/types/server-action-response";

export async function getHabits(
  {
    size = 5,
    page = 1,
    includeQuote = false,
    includeLog = false,
    htype,
    pinned,
  }: {
    size?: number;
    page?: number;
    includeQuote?: boolean;
    includeLog?: boolean;
    htype?: (typeof HabitTypeEnum)[keyof typeof HabitTypeEnum];
    pinned?: boolean;
  } = {
    size: 5,
    page: 1,
    includeQuote: false,
    includeLog: false,
  },
): Promise<
  ServerActionResponse<{ data: (Habit & { logs: number[] })[]; total: number }>
> {
  const res: APIResponse<{
    data: (Habit & { logs: number[] })[];
    total: number;
  }> = await protectedHttpClient("/habit", {
    params: { size, page, includeQuote, includeLog, htype, pinned },
  });

  return res;
}

export async function getHabit(id: string) {
  const result: APIResponse<Habit | null> = await protectedHttpClient(
    `/habit/${id}`,
  );

  return result;
}
