import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Messages } from 'src/common/utils/messages';

export class CreateCustomerDto {
  @IsEmail({}, { message: Messages.VALIDATION_EMAIL_INVALID })
  @IsNotEmpty({ message: Messages.VALIDATION_EMAIL_REQUIRED })
  email: string;

  @IsString()
  @IsNotEmpty({ message: Messages.VALIDATION_FULL_NAME_REQUIRED })
  @MinLength(2, { message: Messages.VALIDATION_FULL_NAME_MIN })
  @MaxLength(200, { message: Messages.VALIDATION_FULL_NAME_MAX })
  fullName: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: Messages.VALIDATION_ADDRESS_MAX })
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: Messages.VALIDATION_CITY_MAX })
  city?: string;
}
