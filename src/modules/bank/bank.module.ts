import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { AuthModule } from 'src/common/auth';
import { PrismaModule } from 'src/prisma';

@Module({
  controllers: [BankController],
  providers: [BankService],
  imports: [PrismaModule, AuthModule],
})
export class BankModule {}
