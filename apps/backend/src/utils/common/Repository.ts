import { TransactionHost } from '@nestjs-cls/transactional';
import { DbStransactionAdapter } from '../../db/db.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export default abstract class Repository {
  constructor(
    protected readonly txHost: TransactionHost<DbStransactionAdapter>,
  ) {}

  getTxHost() {
    return this.txHost;
  }
}
