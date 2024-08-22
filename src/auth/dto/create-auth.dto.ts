import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateAuthDto {
  @IsOptional()
  name: string;
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format!' })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long!' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one special character, one number, and be at least 8 characters long.',
  })
  password: string;
}
