import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import AuthService from '../../../auth/auth.service';
import { AppRequest } from '../../types';
import { Reflector } from '@nestjs/core';
import { AuthConstraint } from '../decorators';
import { UserRoleEnum, UserStatusEnum } from '../../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const constraint = this.reflector.get(AuthConstraint, context.getHandler());

    const req: AppRequest = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) throw new ForbiddenException();
    const user = await this.authService.validateAccessToken(match[1]);
    if (!user) throw new UnauthorizedException();

    if (
      constraint &&
      constraint.role &&
      constraint.role.indexOf(
        user.role as (typeof UserRoleEnum)[keyof typeof UserRoleEnum],
      ) < 0
    ) {
      throw new ForbiddenException();
    }

    if (
      constraint &&
      constraint.status &&
      constraint.status.indexOf(
        user.status as (typeof UserStatusEnum)[keyof typeof UserStatusEnum],
      ) < 0
    ) {
      throw new ForbiddenException();
    }

    req.user = user as typeof req.user;
    return true;
  }
}
