import { User, Deposit, Withdrawal } from '@prisma/client';

export class Account {
  id: number;
  balance: number;
  user: User;
  withdrawal: Withdrawal[];
  deposit: Deposit[];
}
