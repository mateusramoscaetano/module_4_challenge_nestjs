import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';

import { AccountService } from './account.service';
import { CreateAccountDto, UpdateAccountDto } from './dtos';
import { AuthGuard } from 'src/common/auth';
import { PrismaClientExceptionFilter } from 'src/prisma';

@Controller('accounts')
@UseGuards(AuthGuard)
@UseFilters(PrismaClientExceptionFilter)
export class AccountController {
  constructor(private readonly accountsService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  findAll() {
    return this.accountsService.findAll();
  }

  @Get('balance')
  findBalance(@Query('id', ParseIntPipe) id: number) {
    return this.accountsService.findBalance(id);
  }

  @Get('statement')
  findStatement(@Query('id', ParseIntPipe) id: number) {
    return this.accountsService.findStatement(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountDto: UpdateAccountDto
  ) {
    return this.accountsService.update(id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.remove(id);
  }
}
