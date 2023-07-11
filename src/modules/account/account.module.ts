import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/common/auth';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BankProvider } from '../bank/providers';
import { AccountProvider } from './providers';

@Module({
  controllers: [AccountController],
  providers: [AccountService, PrismaService, BankProvider, AccountProvider],
  imports: [AuthModule, PrismaModule],
})
export class AccountModule {}
