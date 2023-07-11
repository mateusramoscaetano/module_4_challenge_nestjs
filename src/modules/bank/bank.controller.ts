import { Controller, Post, Body } from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateBankDto } from './dtos';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  create(@Body() createBankDto: CreateBankDto) {
    return this.bankService.create(createBankDto);
  }
}
