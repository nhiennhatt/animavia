"use server";

import { ApiResponse, AppServerResponse } from "@/types/app";
import {
  LoginBodySchema,
  ILoginBodySchema,
} from "@/validations/user.validation";
import { cookies } from "next/headers";
import z from "zod";

export const login = async (
  body: ILoginBodySchema,
): Promise<AppServerResponse<void>> => {
  const validationResult = await LoginBodySchema.safeParseAsync(body);

  if (!validationResult.success)
    return { success: false, error: z.treeifyError(validationResult.error), code: "VALIDATION_FAILED"};

  try {
    const data = await fetch("http://localhost:3000/auth/token", {
      headers: [["Content-Type", "application/json"]],
      body: JSON.stringify(validationResult.data),
      method: "POST",
    });

    const res: ApiResponse<{ accessToken: string; refreshToken: string }> =
      await data.json();

    if (res.error) {
      return {
        success: false,
        error: res.error,
        code: res.code
      };
    }

    const cookieStore = await cookies();

    cookieStore.set("token", res.data.accessToken);
    cookieStore.set("refresh", res.data.refreshToken);

    return { data: undefined, success: true, code: res.code };
  } catch (err) {
    console.log(err);
    return { success: false, error: { message: "internal error" }, code: "INTERNAL_ERROR" };
  }
};
