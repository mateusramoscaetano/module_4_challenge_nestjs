import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionTransferDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
  @IsNotEmpty()
  @IsNumber()
  destiny_account: number;
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
