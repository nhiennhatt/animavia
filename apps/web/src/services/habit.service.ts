"use server";

import { HabitTypeEnum, LifeDomainEnum } from "@/helpers/constants";
import { AppError } from "@/lib/app-error";
import { ApiResponse, AppServerResponse } from "@/types/app";
import { Habit, Statement } from "@/types/entities";
import {
  createHabitStatementSchema,
  CreateHabitStatementSchema,
  createHabitSchema,
  CreateHabitSchema,
  GetHabitsSchema,
} from "@/validations/habit.validation";
import { cookies } from "next/headers";
import z from "zod";

export async function createHabit(
  body: CreateHabitSchema,
): Promise<AppServerResponse<Habit>> {
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
      method: "POST",
    });

    const body = (await apiResponse.json()) as ApiResponse<Habit>;
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

export async function getHabits(
  params: GetHabitsSchema = { page: 1, size: 5, withRandomQuote: true },
): Promise<
  AppServerResponse<(Habit & { statement?: string; source?: string })[]>
> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const url = new URL("http://localhost:3000/habit");
  Object.entries(params).forEach(([k, v]) => {
    url.searchParams.append(k, `${v}`);
  });

  const apiResponse = await fetch(url.toString(), {
    headers: [["Authorization", `Bearer ${token}`]],
  });

  const response: ApiResponse<
    (Habit & { statement?: string; source?: string })[]
  > = await apiResponse.json();

  return {
    success: true,
    code: "Success",
    data: response.data,
  };
}

export async function addHabitStatement(
  body: CreateHabitStatementSchema,
): Promise<AppServerResponse<Statement>> {
  const validation = await createHabitStatementSchema.safeParseAsync(body);
  if (!validation.success)
    return {
      success: false,
      code: "VALIDATION_FAILED",
      error: z.flattenError(validation.error),
    };

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token)
    return {
      success: false,
      code: "UNAUTHORIZED",
      error: "UNAUTHORIZED",
    };

  try {
    const createResult = await fetch("http://localhost:3000/statement", {
      headers: [
        ["Authorization", `Bearer ${token}`],
        ["Content-Type", "application/json"],
      ],
      body: JSON.stringify(validation.data),
      method: "POST",
    });

    const createReponse: ApiResponse<Statement> = await createResult.json();

    if (createReponse.error)
      throw new AppError(
        createReponse.code,
        createReponse.code,
        createReponse.error,
      );

    return {
      success: true,
      code: "Success",
      data: createReponse.data,
    };
  } catch (err) {
    if (err instanceof AppError) {
      console.log(err.error);
      throw err;
    }

    return {
      success: false,
      code: "INTERNAL_ERROR",
      error: "INTERNAL_ERROR",
    };
  }
}
