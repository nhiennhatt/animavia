import { ServerActionResponse } from "@/libs/types/server-action-response";
import { refreshToken } from "@/services/auth-service";

let refreshPromise: Promise<ServerActionResponse<undefined>> | null;

export async function refreshableQuery<T>(
  callback: () => Promise<ServerActionResponse<T>>,
) {
  const result = await callback();
  if (result.success) return result;

  if (result.code === "TOKEN_EXPIRED" || result.code === "TOKEN_EXPIRED_SOON") {
    if (!refreshPromise) {
      refreshPromise = refreshToken().finally(() => (refreshPromise = null));
    }
    const refreshReuslt = await refreshPromise;

    if (!refreshReuslt.success) return refreshReuslt;

    return await callback();
  }

  return result;
}
