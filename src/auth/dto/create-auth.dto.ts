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

export class CodeAuthDto {
  @IsNotEmpty({ message: 'Must have _id!' })
  _id: string;

  @IsNotEmpty({ message: 'Must have code!' })
  code: string;
}

export class ChangePasswordAuthDto {
  @IsNotEmpty({ message: 'Must have code!' })
  code: string;

  @IsNotEmpty({ message: 'Must have password!' })
  password: string;

  @IsNotEmpty({ message: 'Must have confirmPassword!' })
  confirmPassword: string;

  @IsNotEmpty({ message: 'Must have email!' })
  email: string;
}
