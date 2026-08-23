"use client";

import { regainToken } from "@/services/user.service";
import { AppServerResponse } from "@/types/app";
import { GetTokenPairDto } from "@/types/dto/get-token-pair.dto";

let refreshPromise: Promise<AppServerResponse<GetTokenPairDto>> | null = null;

export async function refreshableQuery<R>(
  callback: () => Promise<AppServerResponse<R>>,
): Promise<AppServerResponse<R>> {
  try {
    const result = await callback();
    if (!result.success) {
      if (result.code.toLowerCase() === "token_expired") {
        if (!refreshPromise) {
          refreshPromise = regainToken().finally(() => {
            refreshPromise = null;
          });
        }
        const refreshedTokenPairResult = await refreshPromise;
        if (refreshedTokenPairResult.success) {
          return await callback();
        }
        return refreshedTokenPairResult;
      }
      return result;
    }
    return result;
  } catch (err) {
    return {
      success: false,
      code: "INTERNAL_ERROR",
      error: "INTERNAL_ERROR",
    };
  }
}
