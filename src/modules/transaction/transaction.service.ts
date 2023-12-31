import * as dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { AccountProvider } from '../account/providers';
import { AccountJwtObject } from '../account/entities';
import {
  CreateTransactionDepositDto,
  CreateTransactionTransferDto,
  CreateTransactionWithdrawalDto,
} from './dtos';
import { BankJwtObject } from '../bank/entities';
import { BankProvider } from '../bank/providers';

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    private bankProvider: BankProvider,
    private accountProvider: AccountProvider
  ) {}

  private get bank(): BankJwtObject {
    return this.bankProvider.user;
  }

  private get account(): AccountJwtObject {
    return this.accountProvider.user;
  }

  async createDeposit(
    createTransactionDepositDto: CreateTransactionDepositDto
  ) {
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
  }

  async createWithdrawal(
    createTransactionWithdrawalDto: CreateTransactionWithdrawalDto
  ) {
    if (!this.account.sub) {
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
  }

  async createTransfer(
    createTransactionTransferDto: CreateTransactionTransferDto
  ) {
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
  }
}
