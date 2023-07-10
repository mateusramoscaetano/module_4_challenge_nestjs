import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Account } from '@prisma/client';
import { BankProvider } from 'src/bank/bank.provider';
import { GetBankDto } from 'src/bank/dto/get-bank.dto';
import { AuthService } from 'src/common/auth/auth.service';
import { AccountProvider } from './accounts.provider';
import { GetAccountDto } from './dto/get-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    private prisma: PrismaService,
    private bankProvider: BankProvider,
    private authService: AuthService,
    private accountProvider: AccountProvider
  ) {}

  private get bank(): GetBankDto {
    return this.bankProvider.user;
  }

  private get account(): GetAccountDto {
    return this.accountProvider.user;
  }

  async create(createAccountDto: CreateAccountDto) {
    try {
      if (!this.bank.sub) {
        throw new UnauthorizedException();
      }

      const hashPassword = await this.authService.hashPassword(
        createAccountDto.user.password
      );

      const account = await this.prisma.account.create({
        data: {
          balance: 0,
          user: {
            create: {
              name: createAccountDto.user.name,
              email: createAccountDto.user.email,
              password: hashPassword,
              birthDate: createAccountDto.user.birthDate,
              phone: createAccountDto.user.phone,
              cpf: createAccountDto.user.cpf,
            },
          },
          Bank: { connect: { id: this.bank.sub } },
        },
      });

      return account;
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target?.includes('cpf')) {
        throw new ConflictException('CPF already exists');
      }
      if (error.meta?.target?.includes('email')) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Account[]> {
    try {
      const bank = await this.prisma.bank.findUnique({
        where: { id: this.bank.sub },
      });

      if (!bank) {
        throw new UnauthorizedException();
      }

      const accounts = await this.prisma.account.findMany({
        where: { bankId: this.bank.sub },
        select: {
          id: true,
          balance: true,
          userEmail: true,
          bankId: true,
          user: {
            select: {
              name: true,
              cpf: true,
              birthDate: true,
              phone: true,
              email: true,
            },
          },
        },
      });

      return accounts;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findBalance(id: number) {
    try {
      if (!this.account.sub || !this.bank.sub) {
        throw new UnauthorizedException('You must be logged in');
      }

      const account = await this.prisma.account.findUnique({
        where: { id },
      });

      if (!account) {
        throw new BadRequestException('Account not found');
      }

      return account.balance;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findStatement(id: number) {
    try {
      if (!this.account.sub || !this.bank.sub) {
        throw new UnauthorizedException('You must be logged in');
      }
      const account = await this.prisma.account.findUnique({
        where: { id },
        include: {
          user: true,
          Deposit: true,
          Transfer: true,
          Withdrawal: true,
        },
      });

      if (!account) {
        throw new BadRequestException('account nott found');
      }

      const deposits = account.Deposit;
      const withdrawals = account.Withdrawal;
      const sentTransfers = account.Transfer;
      const receivedTransfers = await this.prisma.transfer.findMany({
        where: { destiny_account_id: account.id },
      });

      return {
        deposits,
        withdrawals,
        sentTransfers,
        receivedTransfers,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    try {
      if (!this.account.sub || !this.bank.sub) {
        throw new UnauthorizedException('You must be logged in');
      }

      const accountToUpdate = await this.prisma.account.findUnique({
        where: { id },
        include: { user: true },
      });

      const bank = await this.prisma.bank.findUnique({
        where: { id: accountToUpdate.bankId || this.bank.sub },
      });

      if (!bank) {
        throw new UnauthorizedException();
      }

      if (updateAccountDto.user.password) {
        const hashPassword = await this.authService.hashPassword(
          updateAccountDto.user.password
        );

        updateAccountDto.user.password = hashPassword;
      }

      const accounts = await this.prisma.account.findMany({
        where: { bankId: this.bank.sub },
        include: { user: true },
      });

      if (updateAccountDto.user.cpf) {
        const cpfExist = accounts.some(
          (account) => account.user.cpf === updateAccountDto.user.cpf
        );

        if (
          cpfExist &&
          updateAccountDto.user.cpf !== accountToUpdate.user.cpf
        ) {
          throw new BadRequestException('CPF already exists');
        }
      }

      if (updateAccountDto.user.email) {
        const emailExist = accounts.some(
          (account) => account.user.email === updateAccountDto.user.email
        );

        if (
          emailExist &&
          updateAccountDto.user.email !== accountToUpdate.user.email
        ) {
          throw new BadRequestException('Email already exists');
        }
      }

      await this.prisma.account.update({
        where: { id },
        include: { user: true },
        data: {
          user: { update: updateAccountDto.user },
        },
      });

      return 'Account successfully updated';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async remove(id: number) {
    try {
      if (!this.account.sub || !this.bank.sub) {
        throw new UnauthorizedException('You must be logged in');
      }

      const accountToRemove = await this.prisma.account.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!accountToRemove) {
        throw new NotFoundException('Account not found');
      }

      if (accountToRemove.balance !== 0) {
        throw new BadRequestException('Account has balance');
      }

      await this.prisma.account.delete({
        where: { id },
        include: { user: true },
      });

      return 'Account successfully removed';
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
