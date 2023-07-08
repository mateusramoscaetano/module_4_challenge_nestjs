import { Injectable } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/common/auth/auth.service';

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

  findAll() {
    return `This action returns all bank`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bank`;
  }

  update(id: number, updateBankDto: UpdateBankDto) {
    return `This action updates a #${id} bank`;
  }

  remove(id: number) {
    return `This action removes a #${id} bank`;
  }
}
