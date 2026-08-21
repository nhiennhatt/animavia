"use server";

import { protectedHttpClient } from "@/lib/http-client";
import { ApiResponse, AppServerResponse } from "@/types/app";
import { GetHabitsDto } from "@/types/dto/habit.dto";
import { Habit, HabitLog, Statement } from "@/types/entities";
import {
  createHabitStatementSchema,
  CreateHabitStatementSchema,
  createHabitSchema,
  CreateHabitSchema,
  GetHabitsSchema,
  logHabitSchema,
} from "@/validations/habit.validation";
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

  const apiResponse = await protectedHttpClient("/habit", {
    data,
    method: "POST",
  });

  const response = apiResponse.data as ApiResponse<Habit>;
  if (response.error)
    return {
      success: false,
      code: response.code,
      error: response.error,
    };

  return {
    success: true,
    data: response.data,
    code: "SUCCESS",
  };
}

export async function getHabits(
  params: GetHabitsSchema = {},
): Promise<AppServerResponse<GetHabitsDto>> {
  const apiResponse = await protectedHttpClient("/habit", {
    params,
  });

  const response: ApiResponse<GetHabitsDto> = apiResponse.data;

  if (response.error)
    return {
      success: false,
      error: response.error,
      code: response.code,
    };

  return {
    success: true,
    code: "Success",
    data: response.data,
  };
}

export async function deleteHabit({
  id,
}: {
  id: string;
}): Promise<AppServerResponse<undefined>> {
  const idValidation = await z.uuid().safeParseAsync(id);

  if (!idValidation.success) {
    return {
      success: false,
      code: "VALIDATION_FAILED",
      error: z.flattenError(idValidation.error),
    };
  }

  const apiResponse = await protectedHttpClient(`/habit/${id}`, {
    method: "DELETE",
  });

  const res: ApiResponse<void> = apiResponse.data;

  if (res.error) {
    return {
      success: false,
      code: res.code,
      error: res.error,
    };
  }

  return {
    success: true,
    code: "Success",
    data: undefined,
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

  const createResult = await protectedHttpClient("/statement", {
    method: "POST",
    data: validation.data,
  });

  const createReponse: ApiResponse<Statement> = createResult.data;

  if (createReponse.error)
    return {
      code: createReponse.code,
      success: false,
      error: createReponse.error,
    };

  return {
    success: true,
    code: "Success",
    data: createReponse.data,
  };
}

export async function getHabitLogs(
  id: string,
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
): Promise<AppServerResponse<void>> {
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

  const res: ApiResponse<void> = await protectedHttpClient.post(
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
    data: undefined,
  };
}
