import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import AuthService from '../../../auth/auth.service';
import { AppRequest } from '../../types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: AppRequest = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) return false;
    const user = await this.authService.validateAccessToken(match[1]);
    if (!user) return false;
    req.user = user as typeof req.user;
    return true;
  }
}
