import { IsString, IsNotEmpty } from 'class-validator';

export class LoginAccountDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  agency: string;
}
