import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDepositDto } from './dto/create-transaction-deposit.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BankProvider } from 'src/bank/bank.provider';
import { AuthService } from 'src/common/auth/auth.service';
import { GetBankDto } from 'src/bank/dto/get-bank.dto';
import * as dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { CreateTransactionWithdrawalDto } from './dto/create-transaction-withdrawal';
import { CreateTransactionTransferDto } from './dto/create-transaction-transfer';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private bankProvider: BankProvider,
    private authService: AuthService
  ) {}

  private get bank(): GetBankDto {
    return this.bankProvider.user;
  }

  async createDeposit(
    createTransactionDepositDto: CreateTransactionDepositDto
  ) {
    const { id, value } = createTransactionDepositDto;

    if (!id || !value) {
      throw new BadRequestException('Number account and value are required');
    }

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
    const { id, value, password } = createTransactionWithdrawalDto;

    const account = await this.prisma.account.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    const passwordIsValid = await this.authService.comparePassword(
      password,
      account.user.password
    );

    if (!passwordIsValid) {
      throw new BadRequestException('Invalid password or bank account');
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
    const { destiny_account, id, password, value } =
      createTransactionTransferDto;

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

    const passwordIsValid = await this.authService.comparePassword(
      password,
      accountOrigin.user.password
    );

    if (!passwordIsValid) {
      throw new BadRequestException('Invalid password or bank account');
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

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
