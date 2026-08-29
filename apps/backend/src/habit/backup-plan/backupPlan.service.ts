import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  habitBackupPlans,
  habits,
  type AppPgDatabaseType,
} from '../../db/db.schema';
import BackupPlanRepository from './backupPlan.repository';
import HabitService from '../habit/habit.service';

@Injectable()
export default class BackupPlanService {
  constructor(
    private readonly habitService: HabitService,
    private readonly backupPlanRepository: BackupPlanRepository,
  ) {}

  async createBackupPlan(
    habitId: string,
    ifCase: string,
    then: string,
    userId: string,
  ) {
    const existHabit = await this.habitService.checkAlreadyExistingHabit(
      habitId,
      userId,
    );

    if (!existHabit) throw new NotFoundException();

    const opetationResult = await this.backupPlanRepository
      .getTxHost()
      .withTransaction(async () => {
        const currentAmount = await this.backupPlanRepository.count(habitId);

        if (currentAmount <= 0) {
          throw new BadRequestException('OUT_OF_LIMIT');
        }

        const instance = await this.backupPlanRepository.createNewBackupPlan({
          habitId,
          ifCase,
          then,
        });

        return instance;
      });

    if (opetationResult.length === 0) throw new InternalServerErrorException();

    return opetationResult[0];
  }

  async getBackupPlans(userId: string, habitId: string) {
    const existHabit = await this.habitService.checkAlreadyExistingHabit(
      habitId,
      userId,
    );

    if (!existHabit) throw new NotFoundException();

    return await this.backupPlanRepository.getBackupPlans(habitId);
  }

  async deleteBackupPlan(userId: string, backupPlanId: string) {
    const ownedBackupPlan = await this.backupPlanRepository.checkOwnBackupPlan(
      backupPlanId,
      userId,
    );

    if (!ownedBackupPlan) throw new NotFoundException();

    const deleteOperation =
      await this.backupPlanRepository.deleteBackupPlan(backupPlanId);

    return deleteOperation.rowCount;
  }

  async updateBackupPlan(
    userId: string,
    backupPlanId: string,
    set: { ifCase: string; then: string },
  ) {
    const ownedBackupPlan = await this.backupPlanRepository.checkOwnBackupPlan(
      backupPlanId,
      userId,
    );

    if (!ownedBackupPlan) throw new NotFoundException();

    const updateOperation = await this.backupPlanRepository.updateBackupPlan(
      backupPlanId,
      set,
    );

    if (!updateOperation || !updateOperation[0])
      throw new InternalServerErrorException();

    return updateOperation[0];
  }
}
