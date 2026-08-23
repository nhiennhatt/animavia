"use server";

import { AppError } from "@/lib/app-error";
import { ApiResponse, AppServerResponse } from "@/types/app";
import { GetTokenPairDto } from "@/types/dto/get-token-pair.dto";
import { BaseUser } from "@/types/user";
import {
  LoginBodySchema,
  ILoginBodySchema,
  exchangeGoogleTokenSchema,
} from "@/validations/user.validation";
import { cookies, headers } from "next/headers";
import z from "zod";
import { httpClient, protectedHttpClient } from "@/lib/http-client";
import { redirect } from "next/navigation";
import { validateSchemaAsync } from "@/lib/validateSchema";

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

  const data = await httpClient("/auth/token", {
    data: validationResult.data,
    method: "POST",
  });

  const res: ApiResponse<GetTokenPairDto> = data.data;

  if (res.error) {
    return {
      success: false,
      error: res.error,
      code: res.code,
    };
  }

  const cookieStore = await cookies();

  cookieStore.set("token", res.data.accessToken, {
    httpOnly: true,
    sameSite: true,
  });
  cookieStore.set("refresh", res.data.refreshToken, {
    httpOnly: true,
    sameSite: true,
  });

  return { data: undefined, success: true, code: res.code };
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
  const req = await httpClient("/auth/refresh", {
    method: "POST",
    data: { token: refresh.value },
  });

  const res: ApiResponse<GetTokenPairDto> = req.data;

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
};

export const getAuthenticatedUserInform = async (): Promise<
  AppServerResponse<BaseUser | null>
> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token)
    return { code: "UNAUTHORIZED", success: false, error: "UNAUTHORIZED" };

  const req = await protectedHttpClient("/user");

  const res: ApiResponse<BaseUser | null> = req.data;

  if (res.error) {
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
};

export const logout = async () => {
  const cookieStore = await cookies();
  const refresh = cookieStore.get("refresh");

  if (!refresh) return;

  try {
    await httpClient("/auth/logout", {
      method: "DELETE",
      data: { refresh: refresh.value },
    });
  } catch (error) {
  } finally {
    cookieStore.delete("token");
    cookieStore.delete("refresh");
  }
};

export const redirectToGoogleOAuth = async () => {
  const options = {
    redirect_uri: `${process.env.ORIGIN}/oauth/callback`,
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: process.env.GOOGLE_SCOPES || "",
  };

  const urlParams = new URLSearchParams(options);

  redirect(`https://accounts.google.com/o/oauth2/v2/auth?${urlParams}`);
};

export const exchangeGoogleToken = async (
  code: string,
  timezone: string,
): Promise<AppServerResponse<void>> => {
  const validation = await validateSchemaAsync(
    { code, timezone },
    exchangeGoogleTokenSchema,
  );

  if (!validation.success)
    return {
      success: false,
      code: "VALIDATION_FAILED",
      error: validation.error,
    };

  console.log(validation.data);

  const req = await httpClient("/auth/google", {
    data: {
      code: validation.data.code,
      timezone: validation.data.timezone,
    },
    method: "POST",
  });

  const data: ApiResponse<GetTokenPairDto> = req.data;

  if (data.error)
    return {
      success: false,
      code: data.code,
      error: data.error,
    };

  const { accessToken, refreshToken } = data.data;

  const cookieStore = await cookies();

  cookieStore.set("token", accessToken);
  cookieStore.set("refresh", refreshToken);

  return { success: true, data: undefined, code: "SUCCESS" };
};
