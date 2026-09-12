"use server";

import { UserEntity } from "@/libs/entities/user-entity";
import { APIResponse } from "@/libs/types/api-response";
import { ServerActionResponse } from "@/libs/types/server-action-response";
import { protectedHttpClient } from "@/helpers/http-client";

export async function getUserInform(): Promise<
  ServerActionResponse<UserEntity | null>
> {
  const res: APIResponse<UserEntity | null> = await protectedHttpClient(
    "/user",
    {
      method: "GET",
    },
  );

  return res;
}
