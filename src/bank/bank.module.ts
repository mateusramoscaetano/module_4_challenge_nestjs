import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { AuthModule } from 'src/common/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BankController],
  providers: [BankService],
  imports: [PrismaModule, AuthModule],
})
export class BankModule {}
