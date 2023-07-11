import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { BankJwtObject } from '../entities';

@Injectable({ scope: Scope.REQUEST })
export class BankProvider {
  constructor(@Inject(REQUEST) private readonly request) {}

  get user(): BankJwtObject {
    return this.request.user;
  }
}
