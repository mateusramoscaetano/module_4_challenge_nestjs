import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDepositDto } from './dto/create-transaction-deposit.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
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

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }
}
