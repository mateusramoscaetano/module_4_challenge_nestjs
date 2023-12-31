import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';

import { AccountProvider } from './providers';
import { AccountJwtObject } from './entities';
import { BankProvider } from '../bank/providers';
import { BankJwtObject } from '../bank/entities';
import { CreateAccountDto, UpdateAccountDto } from './dtos';
import { Account } from '@prisma/client';
import { PrismaService } from 'src/prisma';
import { AuthService } from 'src/common/auth';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private bankProvider: BankProvider,
    private authService: AuthService,
    private accountProvider: AccountProvider
  ) {}

  private get bank(): BankJwtObject {
    return this.bankProvider.user;
  }

  private get account(): AccountJwtObject {
    return this.accountProvider.user;
  }

  private ensureLoggedIn(): void {
    if (!this.account.sub || !this.bank.sub) {
      throw new UnauthorizedException('You must be logged in');
    }
  }

  private async ensureAccountExists(id: number): Promise<Account> {
    const account = await this.prisma.account.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async create(createAccountDto: CreateAccountDto) {
    if (!this.bank.sub) {
      throw new UnauthorizedException('You must be logged in');
    }

    const hashPassword = await this.authService.hashPassword(
      createAccountDto.user.password
    );

    const account = await this.prisma.account.create({
      data: {
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
  }

  async findAll(): Promise<Account[]> {
    if (!this.bank.sub) {
      throw new UnauthorizedException('You must be logged in');
    }

    const accounts = await this.prisma.account.findMany({
      where: { bankId: this.bank.sub },
      select: {
        id: true,
        balance: true,
        userEmail: true,
        bankId: true,
        isActive: true,
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
  }

  async findBalance(id: number) {
    this.ensureLoggedIn();

    if (id !== this.account.sub || !this.bank.sub) {
      throw new UnauthorizedException(
        'Account dont have access to this balance, or bank is not logged in'
      );
    }

    const account = await this.ensureAccountExists(id);

    return account.balance;
  }

  async findStatement(id: number) {
    this.ensureLoggedIn();

    if (id !== this.account.sub || !this.bank.sub) {
      throw new UnauthorizedException(
        'Account dont have access to this statement, or bank is not logged in'
      );
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
      throw new BadRequestException('Account not found');
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
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    this.ensureLoggedIn();

    if (id !== this.account.sub || !this.bank.sub) {
      throw new UnauthorizedException(
        'Account logged cant update this account, or bank is not logged in'
      );
    }

    const accountToUpdate = await this.prisma.account.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!accountToUpdate) {
      throw new BadRequestException('Account not found');
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

      if (cpfExist && updateAccountDto.user.cpf !== accountToUpdate.user.cpf) {
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
  }

  async remove(id: number) {
    this.ensureLoggedIn();

    if (id !== this.account.sub && !this.bank.sub) {
      throw new UnauthorizedException(
        'Account logged cant desativate this account, or bank is not logged in'
      );
    }

    const accountToDesativate = await this.ensureAccountExists(id);

    if (accountToDesativate.balance !== 0) {
      throw new BadRequestException('Account has balance');
    }

    await this.prisma.account.update({
      where: { id },
      data: { isActive: false },
    });

    return 'Account successfully desactivated';
  }
}
