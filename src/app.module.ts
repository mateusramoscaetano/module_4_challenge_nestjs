import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AccountsModule } from './accounts/accounts.module';
import { BankModule } from './bank/bank.module';

@Module({
  imports: [PrismaModule, AccountsModule, BankModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
