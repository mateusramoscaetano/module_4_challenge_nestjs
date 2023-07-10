import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionDepositDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @IsNumber()
  @IsNotEmpty()
  value: number;
}
