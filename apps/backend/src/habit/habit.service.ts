import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GenerateHabitValidation } from './habit.validation';
import { habits, type AppPgDatabaseType } from '../db/db.schema';

@Injectable()
export default class HabitService {
  constructor(@Inject('DB') private readonly db: AppPgDatabaseType) {}

  async generateHabit(userId: string, habit: GenerateHabitValidation) {
    const generatedHabit = await this.db.insert(habits).values({
      htype: habit.htype,
      domain: habit.domain,
      name: habit.name,
      ownerId: userId,
    });

    if (generatedHabit.rowCount === 0) throw new InternalServerErrorException();

    return { message: 'ok' };
  }
}
