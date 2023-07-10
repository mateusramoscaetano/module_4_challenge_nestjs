import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { GetAccountDto } from './dto/get-account.dto';

@Injectable({ scope: Scope.REQUEST })
export class AccountProvider {
  constructor(@Inject(REQUEST) private readonly request) {}

  get user(): GetAccountDto {
    return this.request.user;
  }
}
