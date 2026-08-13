import { AppError } from "@/lib/app-error";
import { regainToken } from "@/services/user.service";
import { AppServerResponse } from "@/types/app";

export const withProtected = <TArgs extends any[], TResult>(
  action: (...args: TArgs) => Promise<AppServerResponse<TResult>>,
) => {
  return async (...args: TArgs): Promise<AppServerResponse<TResult>> => {
    try {
      return await action(...args);
    } catch (error) {
      if (error instanceof AppError && error.code === "TOKEN_EXPIRED") {
        const newTokenReq = await regainToken();
        if (!newTokenReq.success) return newTokenReq;
        return action(...args);
      }
      return {
        success: false,
        code: "INTERNAL_ERROR",
        error: "INTERNAL_ERROR",
      };
    }
  };
};
