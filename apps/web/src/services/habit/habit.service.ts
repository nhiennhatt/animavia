"use server";
import z from "zod";

import { protectedHttpClient } from "@/lib/http-client";
import { validateSchemaAsync } from "@/lib/validateSchema";
import { ApiResponse, AppServerResponse } from "@/types/app";
import { GetHabitsDto } from "@/types/dto/habit.dto";
import { Habit } from "@/types/entities";
import {
  createHabitSchema,
  CreateHabitSchema,
  GetHabitsSchema,
} from "@/validations/habit.validation";

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

export async function getHabit(id: string): Promise<AppServerResponse<Habit>> {
  const validate = await validateSchemaAsync(id, z.uuid());

  if (!validate.success) {
    return {
      success: false,
      error: validate.error,
      code: "VALIDATION_FAILED",
    };
  }

  const res = await protectedHttpClient(`/habit/${validate.data}`);
  const data: ApiResponse<Habit> = res.data;

  if (data.error) {
    return {
      success: false,
      code: data.code,
      error: data.error,
    };
  }

  return {
    code: "SUCCESS",
    success: true,
    data: data.data,
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
