import { User } from '@prisma/client';

type RequiredUserFields = Required<User>;

export class CreateAccountDto {
  user: RequiredUserFields;
}
