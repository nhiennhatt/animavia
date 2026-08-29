import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CreateStatementSchema,
  UpdateStatementSchema,
} from './statement.validation';
import { AppUser } from '../../utils/types';
import HabitService from '../habit/habit.service';
import StatementRepository from './statement.repository';

@Injectable()
export default class StatementService {
  constructor(
    private readonly statementRepository: StatementRepository,
    private readonly habitService: HabitService,
  ) {}

  async createHabitStatement(
    user: AppUser,
    { habitId, source, statement }: CreateStatementSchema,
  ) {
    const result = await this.statementRepository
      .getTxHost()
      .withTransaction(async () => {
        const result = await this.habitService.checkAlreadyExistingHabit(
          habitId,
          user.id,
        );

        if (!result) throw new NotFoundException();

        const amount = await this.statementRepository.countStatements(habitId);

        if (amount >= 10)
          throw new HttpException('OUT_OF_LIMT', HttpStatus.BAD_REQUEST);

        return await this.statementRepository.createNewStatement(
          habitId,
          statement,
          source,
        );
      });

    return result[0];
  }

  async getStatementsByHabit({
    userId,
    habitId,
    pageSize = 5,
    page = 1,
    random = false,
  }: {
    habitId: string;
    userId: string;
    pageSize?: number;
    page?: number;
    random?: boolean;
  }) {
    const habit = await this.habitService.checkAlreadyExistingHabit(
      habitId,
      userId,
    );

    if (!habit) throw new NotFoundException();

    if (random) {
      return this.statementRepository.getStatementsWithRandomOrder(
        habitId,
        pageSize,
        page,
      );
    } else {
      return this.statementRepository.getStatements(habitId, pageSize, page);
    }
  }

  async getStatement(id: string, userId: string) {
    const statement = await this.statementRepository.getStatement(id, userId);

    if (!statement || statement.length <= 0) throw new NotFoundException();

    return statement[0];
  }

  async updateStatement(
    id: string,
    body: UpdateStatementSchema,
    userId: string,
  ) {
    const existingStatement =
      await this.statementRepository.checkExistingStatement(id, userId);

    if (!existingStatement) throw new NotFoundException();

    return await this.statementRepository.updatestatement(id, body);
  }

  async deleteStatement(id: string, userId: string) {
    const existStatement =
      await this.statementRepository.checkExistingStatement(id, userId);

    if (!existStatement) throw new NotFoundException();

    await this.statementRepository.deleteStatement(id);
  }
}
