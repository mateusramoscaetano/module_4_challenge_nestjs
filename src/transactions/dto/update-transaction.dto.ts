import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDepositDto } from './create-transaction-deposit.dto';

export class UpdateTransactionDto extends PartialType(
  CreateTransactionDepositDto
) {}
