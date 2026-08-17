"use server";

import { ApiResponse, AppServerResponse } from "@/types/app";
import {
  createHabitSchema,
  CreateHabitSchema,
} from "@/validations/habit.validation";
import { cookies } from "next/headers";
import z from "zod";

export async function createHabit(
  body: CreateHabitSchema,
): Promise<AppServerResponse<{ id: string }>> {
  const validation = await createHabitSchema.safeParseAsync(body);
  if (!validation.success)
    return {
      success: false,
      code: "VALIDATION_FAILED",
      error: z.flattenError(validation.error),
    };

  const data = validation.data;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token)
    return {
      success: false,
      code: "UNAUTHORIZED",
      error: "UNAUTHORIZED",
    };

  try {
    const apiResponse = await fetch("http://localhost:3000/habit", {
      headers: [
        ["Content-Type", "application/json"],
        ["Authorization", `bearer ${token}`],
      ],
      body: JSON.stringify(data),
      method: "POST"
    });

    const body = (await apiResponse.json()) as ApiResponse<{ id: string }>;
    if (body.error)
      return {
        success: false,
        code: body.code,
        error: body.error,
      };

    return {
      success: true,
      data: body.data,
      code: "SUCCESS",
    };
  } catch (err) {
    console.log(err);

    return {
      success: false,
      code: "INTERNAL_ERROR",
      error: "INTERNAL_ERROR",
    };
  }
}
