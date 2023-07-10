import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/common/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BankProvider } from 'src/bank/bank.provider';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService, BankProvider],
  imports: [PrismaModule, AuthModule],
})
export class TransactionsModule {}
