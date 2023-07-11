import { Account, Deposit, Transfer, Withdrawal } from '@prisma/client';

export class Bank {
  id: number;
  name: string;
  number: string;
  agency: string;
  password: string;
  accounts: Account[];
  withdrawals: Withdrawal[];
  deposits: Deposit[];
  transfers: Transfer[];
}

export class BankJwtObject {
  sub: number;
  agency: string;
  iat: number;
  exp: number;
}
