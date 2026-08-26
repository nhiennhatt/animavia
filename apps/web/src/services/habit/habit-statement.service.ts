"use server";
import z from "zod";

import { protectedHttpClient } from "@/lib/http-client";
import { validateSchemaAsync } from "@/lib/validateSchema";
import { ApiResponse, AppServerResponse } from "@/types/app";
import { Statement } from "@/types/entities";
import {
  createHabitStatementSchema,
  CreateHabitStatementSchema,
  getHabitStatementsSchema,
  GetHabitStatementsSchema,
} from "@/validations/habit.validation";

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

export async function getHabitStatements(
  params: GetHabitStatementsSchema,
): Promise<AppServerResponse<Statement[]>> {
  const validation = await validateSchemaAsync(
    params,
    getHabitStatementsSchema,
  );

  if (!validation.success) {
    return {
      ...validation,
      code: "VALIDATION_FAILED",
    };
  }

  const req = await protectedHttpClient("/statement", {
    params: { ...validation.data, random: validation.data.random ? 1 : 0 },
  });

  const res: ApiResponse<Statement[]> = req.data;

  if (res.error) {
    return {
      success: false,
      code: res.code,
      error: res.error,
    };
  }

  return {
    success: true,
    data: res.data || [],
    code: "SUCCESS",
  };
}
