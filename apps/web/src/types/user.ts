import { UserRoleEnum, UserStatusEnum } from "@/helpers/constants";

export interface BaseUser {
  givenName: string;
  role: (typeof UserRoleEnum)[keyof typeof UserRoleEnum];
  status: (typeof UserStatusEnum)[keyof typeof UserStatusEnum];
  email: string;
}
