import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetCustomerByEmailDto {
  @IsEmail({}, { message: 'El formato del correo no es válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  email: string;
}
