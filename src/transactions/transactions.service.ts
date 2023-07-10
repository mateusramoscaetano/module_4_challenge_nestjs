import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTransactionDepositDto } from './dto/create-transaction-deposit.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BankProvider } from 'src/bank/bank.provider';
import { AuthService } from 'src/common/auth/auth.service';
import { GetBankDto } from 'src/bank/dto/get-bank.dto';
import * as dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { CreateTransactionWithdrawalDto } from './dto/create-transaction-withdrawal';
import { CreateTransactionTransferDto } from './dto/create-transaction-transfer';
import { AccountProvider } from 'src/accounts/accounts.provider';
import { GetAccountDto } from 'src/accounts/dto/get-account.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private bankProvider: BankProvider,
    private accountProvider: AccountProvider
  ) {}

  private get bank(): GetBankDto {
    return this.bankProvider.user;
  }

  private get account(): GetAccountDto {
    return this.accountProvider.user;
  }

  async createDeposit(
    createTransactionDepositDto: CreateTransactionDepositDto
  ) {
    try {
      const { id, value } = createTransactionDepositDto;

      const account = await this.prisma.account.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!account) {
        throw new BadRequestException('Account not found');
      }

      if (value <= 0) {
        throw new BadRequestException('Value must be greater than 0');
      }

      await this.prisma.account.update({
        where: { id },

        data: {
          balance: account.balance + value,
        },
      });

      const date = dayjs();
      const dateFormated = date.format('YYYY-MM-DD HH:mm:ss');

      await this.prisma.deposit.create({
        data: {
          date: dateFormated,
          account_id: account.id,
          value: value,
          bankId: account.bankId,
        },
      });

      return 'Successful deposit';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createWithdrawal(
    createTransactionWithdrawalDto: CreateTransactionWithdrawalDto
  ) {
    try {
      if (!this.account) {
        throw new UnauthorizedException();
      }

      const { id, value } = createTransactionWithdrawalDto;

      const account = await this.prisma.account.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!account) {
        throw new BadRequestException('Account not found');
      }

      if (account.balance < value) {
        throw new BadRequestException('Insufficient balance');
      }

      await this.prisma.account.update({
        where: { id },

        data: {
          balance: account.balance - value,
        },
      });

      const date = dayjs();
      const dateFormated = date.format('YYYY-MM-DD HH:mm:ss');

      await this.prisma.withdrawal.create({
        data: {
          date: dateFormated,
          account_id: account.id,
          value: value,
          bankId: account.bankId,
        },
      });

      return 'Sucessfull withdrawal ';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createTransfer(
    createTransactionTransferDto: CreateTransactionTransferDto
  ) {
    try {
      const { destiny_account, id, value } = createTransactionTransferDto;

      const accountOrigin = await this.prisma.account.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!accountOrigin) {
        throw new BadRequestException('Account origin not found');
      }

      const accountDestiny = await this.prisma.account.findUnique({
        where: { id: destiny_account },
      });

      if (!accountDestiny) {
        throw new BadRequestException('Account destiny not found');
      }

      if (accountOrigin.balance < value) {
        throw new BadRequestException('Insufficient balance');
      }

      await this.prisma.account.update({
        where: { id },
        data: { balance: accountOrigin.balance - value },
      });

      await this.prisma.account.update({
        where: { id: destiny_account },
        data: {
          balance: accountDestiny.balance + value,
        },
      });

      const date = dayjs();
      const dateFormated = date.format('YYYY-MM-DD HH:mm:ss');

      await this.prisma.transfer.create({
        data: {
          date: dateFormated,
          origin_account_id: accountOrigin.id,
          destiny_account_id: accountDestiny.id,
          value: value,
          bankId: accountOrigin.bankId,
          accountId: accountOrigin.id,
        },
      });

      return 'Transfer sucessfull';
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
