import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PrismaModule, PrismaService } from 'src/prisma';
import { BankProvider } from '../bank/providers';
import { AccountProvider } from '../account/providers';
import { AuthModule } from 'src/common/auth';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService, BankProvider, AccountProvider],
  imports: [PrismaModule, AuthModule],
})
export class TransactionsModule {}
