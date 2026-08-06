import { Controller, Get, UseGuards } from '@nestjs/common';
import { Auth, User } from '../utils/common/decorators';
import type { AppUser } from '../utils/types';
import { AuthGuard } from '../utils/common/guards';
import { UserRoleEnum } from '../utils/constants';

@Controller('user')
export default class UserController {
  @Get('')
  @Auth({ role: [UserRoleEnum.CONTENT_CURATOR, UserRoleEnum.PRACTITIONER] })
  @UseGuards(AuthGuard)
  testUser(@User() user: AppUser) {
    return user;
  }
}
