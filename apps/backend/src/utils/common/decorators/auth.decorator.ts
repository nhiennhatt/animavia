import { AuthConstraint } from './auth-constraint.decorator';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards';
import { UserRoleEnum, UserStatusEnum } from '../../constants';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Auth(constraints?: {
  role?: (typeof UserRoleEnum)[keyof typeof UserRoleEnum][];
  status?: (typeof UserStatusEnum)[keyof typeof UserStatusEnum][];
}) {
  return applyDecorators(
    AuthConstraint(constraints),
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse(),
  );
}
