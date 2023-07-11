import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountDto {
  user: User;
}

class User {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDate()
  @IsNotEmpty()
  birthDate: Date;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
