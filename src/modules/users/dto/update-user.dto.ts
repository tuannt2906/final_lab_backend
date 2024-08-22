import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsMongoId({ message: '_id is invalid' })
  @IsNotEmpty({ message: "_id can't be empty" })
  _id: string;

  @IsOptional()
  @IsNotEmpty({ message: 'Name should not be empty.' })
  @MinLength(1, { message: 'Username is required and should not be empty.' })
  @MaxLength(255, {
    message: 'Username should not be longer than 255 characters.',
  })
  name: string;

  @IsOptional()
  @Matches(/^\+\d+$/, {
    message: 'Phone number must be in the format "+xxxxx"',
  })
  phone: string;

  @IsOptional()
  address?: string;

  @IsString()
  image?: string;
}
