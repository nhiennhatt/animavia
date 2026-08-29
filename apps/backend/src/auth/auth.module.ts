import { Global, Module } from '@nestjs/common';
import AuthService from './auth.service';
import AuthController from './auth.controller';
import { JwtService } from './jwt.service';
import { loadKey } from '../utils';
import AuthRepository from './auth.repository';

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    AuthRepository,
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
  exports: [AuthService],
})
export default class AuthModule {}
