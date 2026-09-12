"use server";

import { cookies } from "next/headers";

import { APIResponse } from "@/libs/types/api-response";
import { TokenPairDto } from "@/libs/types/dto/auth.dto";
import { ServerActionResponse } from "@/libs/types/server-action-response";
import { httpClient } from "@/helpers/http-client";

export async function signIn(
  email: string,
  password: string,
): Promise<ServerActionResponse<undefined>> {
  const cookieStore = await cookies();
  const res: APIResponse<TokenPairDto> = await httpClient("/auth/token", {
    data: { email, password },
    method: "POST",
  });

  if (!res.success) return res;

  cookieStore.set("accessToken", res.data.accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  cookieStore.set("refreshToken", res.data.refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return {
    success: true,
    code: "SUCCESS",
    data: undefined,
  };
}

export async function refreshToken(): Promise<ServerActionResponse<undefined>> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");

  if (!refreshToken)
    return {
      success: false,
      code: "UNAUTHORIZED",
      error: "UNAUTHORIZED",
    };

  const res: APIResponse<TokenPairDto> = await httpClient("/auth/refresh", {
    data: {
      token: refreshToken.value,
    },
    method: "POST",
  });

  if (res.success) {
    cookieStore.set("accessToken", res.data.accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    cookieStore.set("refreshToken", res.data.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return {
    success: true,
    data: undefined,
    code: "SUCCESS",
  };
}

export async function logout(): Promise<ServerActionResponse<undefined>> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");

  if (!refreshToken)
    return {
      success: false,
      code: "UNAUTHORIZED",
      error: "UNAUTHORIZED",
    };

  const res: APIResponse<TokenPairDto> = await httpClient("/auth/logout", {
    data: {
      refresh: refreshToken.value,
    },
    method: "DELETE",
  });

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  return {
    success: true,
    code: "SUCCESS",
    data: undefined,
  };
}
