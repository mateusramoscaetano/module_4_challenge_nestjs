import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionWithdrawalDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
  @IsNumber()
  @IsNotEmpty()
  value: number;
}
