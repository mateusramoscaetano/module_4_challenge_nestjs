import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/auth';
import { TransactionService } from './transaction.service';
import {
  CreateTransactionDepositDto,
  CreateTransactionTransferDto,
  CreateTransactionWithdrawalDto,
} from './dtos';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  create(@Body() createTransactionDepositDto: CreateTransactionDepositDto) {
    return this.transactionService.createDeposit(createTransactionDepositDto);
  }

  @Post('withdrawal')
  createWithdrawal(
    @Body() createTransactionWithdrawalDto: CreateTransactionWithdrawalDto
  ) {
    return this.transactionService.createWithdrawal(
      createTransactionWithdrawalDto
    );
  }

  @Post('transfer')
  createTransfer(
    @Body() createTransactionTransferDto: CreateTransactionTransferDto
  ) {
    return this.transactionService.createTransfer(createTransactionTransferDto);
  }
}
