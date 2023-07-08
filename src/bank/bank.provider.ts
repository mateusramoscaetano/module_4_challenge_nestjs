import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { GetBankDto } from '../bank/dto/get-bank.dto';

@Injectable({ scope: Scope.REQUEST })
export class BankProvider {
  constructor(@Inject(REQUEST) private readonly request) {}

  get user(): GetBankDto {
    return this.request.user;
  }
}
