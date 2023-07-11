import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/common/auth';
import { PrismaService } from 'src/prisma';
import { CreateBankDto } from './dtos';

@Injectable()
export class BankService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService
  ) {}

  async create(createBankDto: CreateBankDto) {
    const hashedPassword = await this.authService.hashPassword(
      createBankDto.password
    );

    await this.prisma.bank.create({
      data: { ...createBankDto, password: hashedPassword },
    });

    return { ...createBankDto, password: '-' };
  }
}
