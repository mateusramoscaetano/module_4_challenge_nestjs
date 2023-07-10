import { Controller, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDepositDto } from './dto/create-transaction-deposit.dto';
import { CreateTransactionWithdrawalDto } from './dto/create-transaction-withdrawal';
import { CreateTransactionTransferDto } from './dto/create-transaction-transfer';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  create(@Body() createTransactionDepositDto: CreateTransactionDepositDto) {
    return this.transactionsService.createDeposit(createTransactionDepositDto);
  }

  @Post('withdrawal')
  createWithdrawal(
    @Body() createTransactionWithdrawalDto: CreateTransactionWithdrawalDto
  ) {
    return this.transactionsService.createWithdrawal(
      createTransactionWithdrawalDto
    );
  }

  @Post('transfer')
  createTransfer(
    @Body() createTransactionTransferDto: CreateTransactionTransferDto
  ) {
    return this.transactionsService.createTransfer(
      createTransactionTransferDto
    );
  }
}
