import { Module } from '@nestjs/common';

import { AccountModule } from './modules/account/account.module';
import { BankModule } from './modules/bank/bank.module';
import { TransactionsModule } from './modules/transaction/transaction.module';
import { PrismaModule } from './prisma';

@Module({
  imports: [PrismaModule, AccountModule, BankModule, TransactionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
