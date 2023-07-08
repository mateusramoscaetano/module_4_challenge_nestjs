export class UpdateAccountDto {
  user: {
    name?: string;
    cpf?: string;
    birthDate?: Date;
    email?: string;
    password?: string;
  };
}
