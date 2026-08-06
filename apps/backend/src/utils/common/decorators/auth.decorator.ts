import { Reflector } from '@nestjs/core';
import { UserRoleEnum, UserStatusEnum } from '../../constants';

export const Auth = Reflector.createDecorator<
  | {
      role?: (typeof UserRoleEnum)[keyof typeof UserRoleEnum][];
      status?: (typeof UserStatusEnum)[keyof typeof UserStatusEnum][];
    }
  | undefined
>();
