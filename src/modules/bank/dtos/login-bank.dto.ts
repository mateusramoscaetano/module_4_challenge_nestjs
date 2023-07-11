import { IsString, IsNotEmpty } from 'class-validator';

export class LoginBankDto {
  @IsString()
  @IsNotEmpty()
  agency: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
