import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsEmail({}, { message: 'El formato del correo no es válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede exceder 200 caracteres' })
  fullName: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La dirección no puede exceder 500 caracteres' })
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'La ciudad no puede exceder 100 caracteres' })
  city?: string;
}
