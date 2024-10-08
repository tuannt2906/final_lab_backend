import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name should not be empty.' })
  @MinLength(1, { message: 'Username is required and should not be empty.' })
  @MaxLength(255, {
    message: 'Username should not be longer than 255 characters.',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format!' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one special character, one number, and be at least 8 characters long.',
  })
  password: string;

  @Matches(/^\+\d+$/, {
    message: 'Phone number must be in the format "+xxxxx"',
  })
  phone: string;
}
