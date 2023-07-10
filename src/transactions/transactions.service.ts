import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BankProvider } from 'src/bank/bank.provider';
import { AuthService } from 'src/common/auth/auth.service';
import { GetBankDto } from 'src/bank/dto/get-bank.dto';
import * as dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

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

  async create(createTransactionDto: CreateTransactionDto) {
    if (!createTransactionDto.id || !createTransactionDto.value) {
      throw new BadRequestException('Number account and value are required');
    }

    const account = await this.prisma.account.findUnique({
      where: { id: createTransactionDto.id },
      include: { user: true },
    });

    if (!account) {
      throw new BadRequestException('Account not found');
    }

    if (createTransactionDto.value <= 0) {
      throw new BadRequestException('Value must be greater than 0');
    }

    await this.prisma.account.update({
      where: { id: createTransactionDto.id },

      data: {
        balance: account.balance + createTransactionDto.value,
      },
    });

    const date = dayjs();
    const dateFormated = date.format('YYYY-MM-DD HH:mm:ss');

    await this.prisma.deposit.create({
      data: {
        date: dateFormated,
        account_id: account.id,
        value: createTransactionDto.value,
        bankId: account.bankId,
      },
    });

    return 'Successful deposit';
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
