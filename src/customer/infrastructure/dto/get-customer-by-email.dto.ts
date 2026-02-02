import { IsEmail, IsNotEmpty } from 'class-validator';
import { Messages } from 'src/common/utils/messages';

export class GetCustomerByEmailDto {
  @IsEmail({}, { message: Messages.VALIDATION_EMAIL_INVALID })
  @IsNotEmpty({ message: Messages.VALIDATION_EMAIL_REQUIRED })
  email: string;
}
