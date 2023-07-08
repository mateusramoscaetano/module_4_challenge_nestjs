import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginAccountDto } from 'src/accounts/dto/login-account.dto';
import { LoginBankDto } from 'src/bank/dto/login-bank.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() loginBankDto: LoginBankDto) {
    return this.authService.signInBank(loginBankDto);
  }
  @Post('login/accounts')
  signInAccount(@Body() loginAccountDto: LoginAccountDto) {
    return this.authService.signInAccount(loginAccountDto);
  }
}
