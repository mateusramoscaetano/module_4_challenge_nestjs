import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { AccountJwtObject } from '../entities';

@Injectable({ scope: Scope.REQUEST })
export class AccountProvider {
  constructor(@Inject(REQUEST) private readonly request) {}

  get user(): AccountJwtObject {
    return this.request.user;
  }
}
