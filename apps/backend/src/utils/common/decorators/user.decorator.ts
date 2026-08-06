import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppRequest } from '../../types';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: AppRequest = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
