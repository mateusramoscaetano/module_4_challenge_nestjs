import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BankProvider } from 'src/bank/bank.provider';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/common/auth/auth.module';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, PrismaService, BankProvider],
  imports: [AuthModule, PrismaModule],
})
export class AccountsModule {}
