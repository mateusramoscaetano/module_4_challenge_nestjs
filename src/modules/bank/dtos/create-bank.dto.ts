import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBankDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  agency: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
