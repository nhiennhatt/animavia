import { Module } from '@nestjs/common';
import AuthService from './auth.service';
import AuthController from './auth.controller';
import { JwtService } from './jwt.service';
import { loadKey } from '../utils';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'ACCESS_PRIVATE_KEY',
      useFactory: async () => await loadKey('access-private'),
    },
    {
      provide: 'ACCESS_PUBLIC_KEY',
      useFactory: async () => await loadKey('access-public'),
    },
    {
      provide: 'REFRESH_PRIVATE_KEY',
      useFactory: async () => await loadKey('refresh-private'),
    },
    {
      provide: 'REFRESH_PUBLIC_KEY',
      useFactory: async () => await loadKey('refresh-public'),
    },
    JwtService,
  ],
})
export default class AuthModule {}
