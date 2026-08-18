"use client";

import { regainToken } from "@/services/user.service";
import { AppServerResponse } from "@/types/app";
import { GetTokenPairDto } from "@/types/dto/get-token-pair.dto";
import z from "zod";

let refreshPromise: Promise<AppServerResponse<GetTokenPairDto>> | null = null;

export async function refreshableQuery<T extends z.ZodObject, R>({
  params,
  ValidationSchema,
  callback,
  hasParams,
}:
  | {
      hasParams: true;
      params: z.infer<T>;
      ValidationSchema: T;
      callback: (p: z.infer<T>) => Promise<AppServerResponse<R>>;
    }
  | {
      hasParams: false;
      params?: undefined;
      ValidationSchema?: undefined;
      callback: () => Promise<AppServerResponse<R>>;
    }): Promise<AppServerResponse<R>> {
  let determinedCallback: () => Promise<AppServerResponse<R>>;

  if (hasParams) {
    const validate = await ValidationSchema.safeParseAsync(params);

    if (!validate.success)
      return {
        success: false,
        code: "VALIDATION_FAILED",
        error: z.flattenError(validate.error),
      };

    determinedCallback = () => callback(validate.data);
  } else {
    determinedCallback = () => callback();
  }

  try {
    const result = await determinedCallback();
    if (!result.success) {
      if (result.code.toLowerCase() === "token_expired") {
        if (!refreshPromise) {
          refreshPromise = regainToken().finally(() => {
            refreshPromise = null;
          });
        }
        const refreshedTokenPairResult = await refreshPromise;
        console.log(refreshedTokenPairResult);
        if (refreshedTokenPairResult.success) {
          return await determinedCallback();
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
