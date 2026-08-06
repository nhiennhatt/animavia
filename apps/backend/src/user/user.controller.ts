import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '../utils/common/decorators';
import type { AppUser } from '../utils/types';
import { AuthGuard } from '../utils/common/guards';

@Controller('user')
export default class UserController {
  @Get('')
  @UseGuards(AuthGuard)
  testUser(@User() user: AppUser) {
    return user;
  }
}
