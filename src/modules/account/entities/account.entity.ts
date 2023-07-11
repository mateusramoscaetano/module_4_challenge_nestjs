import { User, Deposit, Withdrawal, Transfer } from '@prisma/client';

export class Account {
  id: number;
  balance: number;
  user: User;
  withdrawal: Withdrawal[];
  deposit: Deposit[];
  transfer: Transfer[];
}

export class AccountJwtObject {
  sub: number;
  userEmail: string;
  iat: number;
  exp: number;
}
