import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { LoginAccountDto } from 'src/accounts/dto/login-account.dto';
import { LoginBankDto } from 'src/bank/dto/login-bank.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signInBank(loginBankDto: LoginBankDto): Promise<any> {
    const bank = await this.prisma.bank.findUnique({
      where: { agency: loginBankDto.agency },
    });

    if (!bank) {
      throw new UnauthorizedException();
    }

    const passwordValidate = await this.comparePassword(
      loginBankDto.password,
      bank.password
    );

    if (!passwordValidate) {
      throw new UnauthorizedException();
    }

    const acess_token = await this.signToken(bank.id, bank.agency);

    return acess_token;
  }

  async signInAccount(loginAccountDto: LoginAccountDto): Promise<any> {
    const bank = await this.prisma.bank.findUnique({
      where: { agency: loginAccountDto.agency },
    });

    if (!bank) {
      throw new UnauthorizedException();
    }

    const accounts = await this.prisma.account.findMany({
      where: { bankId: bank.id },
      include: {
        user: true,
      },
    });

    if (!accounts) {
      throw new UnauthorizedException();
    }

    const accountToLog = accounts.find(
      (account) => account.user.email === loginAccountDto.email
    );

    if (!accountToLog) {
      throw new UnauthorizedException();
    }

    const passwordValidate = await this.comparePassword(
      loginAccountDto.password,
      accountToLog.user.password
    );

    if (!passwordValidate) {
      throw new UnauthorizedException();
    }

    const acess_token = await this.signToken(
      accountToLog.id,
      accountToLog.userEmail
    );

    return acess_token;
  }

  async signToken(
    id: number,
    identityConnector?: string
  ): Promise<{ access_token: string; redirect: string | undefined }> {
    const payload = {
      sub: id,
      identityConnector,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      redirect: '/',
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await hash(password, saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const result = await compare(password, hashedPassword);
    return result;
  }
}
