import { LoginBankDto } from 'src/modules/bank/dtos';
import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginAccountDto } from 'src/modules/account/dtos';

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
