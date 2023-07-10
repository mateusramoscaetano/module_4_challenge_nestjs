import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

class User {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsDate()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  @IsEmail()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;
}

export class UpdateAccountDto {
  @IsNotEmpty()
  user: User;
}
