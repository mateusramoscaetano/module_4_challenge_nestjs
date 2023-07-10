import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AuthModule } from 'src/common/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BankProvider } from 'src/bank/bank.provider';
import { AccountProvider } from 'src/accounts/accounts.provider';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    PrismaService,
    BankProvider,
    AccountProvider,
  ],
  imports: [PrismaModule, AuthModule],
})
export class TransactionsModule {}
