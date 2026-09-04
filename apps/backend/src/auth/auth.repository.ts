import { Injectable } from '@nestjs/common';
import Repository from '../utils/common/Repository';
import { users } from '../db/db.schema';

@Injectable()
export default class AuthRepository extends Repository {
  async isExistingUser(email: string) {
    const result = await this.txHost.tx.query.users.findFirst({
      columns: { id: true },
      where: {
        email,
      },
    });

    return !!result;
  }

  createNewUser(data: typeof users.$inferInsert) {
    return this.txHost.tx
      .insert(users)
      .values(data)
      .onConflictDoNothing({ target: users.email });
  }

  getUser(email: string) {
    return this.txHost.tx.query.users.findFirst({ where: { email } });
  }

  getProtectedUserById(id: string) {
    return this.txHost.tx.query.users.findFirst({
      columns: {
        email: true,
        givenName: true,
        id: true,
        role: true,
        status: true,
        timezone: true,
      },
      where: { id },
    });
  }

  getUserById(id: string) {
    return this.txHost.tx.query.users.findFirst({ where: { id } });
  }

  upsertUser(data: typeof users.$inferInsert) {
    return this.txHost.tx
      .insert(users)
      .values(data)
      .onConflictDoUpdate({
        target: users.email,
        set: {
          givenName: data.givenName,
        },
      })
      .returning();
  }
}
