"use server";

import { AppError } from "@/lib/app-error";
import { ApiResponse, AppServerResponse } from "@/types/app";
import { GetTokenPairDto } from "@/types/dto/get-token-pair.dto";
import { BaseUser } from "@/types/user";
import {
  LoginBodySchema,
  ILoginBodySchema,
} from "@/validations/user.validation";
import { cookies } from "next/headers";
import z, { success } from "zod";
import { withProtected } from "../helpers/with-protected";

export const login = async (
  body: ILoginBodySchema,
): Promise<AppServerResponse<void>> => {
  const validationResult = await LoginBodySchema.safeParseAsync(body);

  if (!validationResult.success)
    return {
      success: false,
      error: z.treeifyError(validationResult.error),
      code: "VALIDATION_FAILED",
    };

  try {
    const data = await fetch("http://localhost:3000/auth/token", {
      headers: [["Content-Type", "application/json"]],
      body: JSON.stringify(validationResult.data),
      method: "POST",
    });

    const res: ApiResponse<GetTokenPairDto> = await data.json();

    if (res.error) {
      return {
        success: false,
        error: res.error,
        code: res.code,
      };
    }

    const cookieStore = await cookies();

    cookieStore.set("token", res.data.accessToken);
    cookieStore.set("refresh", res.data.refreshToken);

    return { data: undefined, success: true, code: res.code };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      error: { message: "internal error" },
      code: "INTERNAL_ERROR",
    };
  }
};

export const regainToken = async (): Promise<
  AppServerResponse<GetTokenPairDto>
> => {
  const cookieStore = await cookies();
  const refresh = cookieStore.get("refresh");

  if (!refresh)
    return {
      success: false,
      code: "UNAUTHENTICATED",
      error: "UNAUTHENTICATED",
    };

  try {
    const req = await fetch("http://localhost:3000/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ token: refresh.value }),
      headers: [["Content-Type", "application/json"]],
    });

    const res: ApiResponse<GetTokenPairDto> = await req.json();

    if (res.error)
      return {
        success: false,
        error: res.error,
        code: "UNAUTHENTICATED",
      };

    cookieStore.set("token", res.data.accessToken);
    cookieStore.set("refresh", res.data.refreshToken);

    return {
      data: {
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      },
      success: true,
      code: res.code,
    };
  } catch (err) {
    return {
      success: false,
      code: "INTERNAL_ERROR",
      error: "INTERNAL_ERROR",
    };
  }
};

export const getAuthenticatedUserInform = withProtected(
  async (): Promise<AppServerResponse<BaseUser | null>> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token)
      return { code: "UNAUTHORIZED", success: false, error: "UNAUTHORIZED" };

    const req = await fetch("http://localhost:3000/user", {
      headers: [["Authorization", `Bearer ${token.value}`]],
    });

    const res: ApiResponse<BaseUser | null> = await req.json();

    if (res.error) {
      if (res.code === "TOKEN_EXPIRED") {
        throw new AppError("TOKEN_EXPIRED", "TOKEN_EXPIRED");
      }

      return {
        success: false,
        code: res.code,
        error: res.error,
      };
    }

    return {
      success: true,
      code: "SUCCESS",
      data: res.data,
    };
  },
);

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("refresh");
}
