'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, MaxLength, IsAlphanumeric } from 'class-validator';

export class CreateUserDto {
  @IsAlphanumeric()
  @ApiProperty()
  @MaxLength(50)
  private readonly user_name: string;

  @IsInt({ message: 'age should a number.' })
  @ApiProperty()
  private readonly age: number;

  @IsAlphanumeric()
  @ApiProperty()
  @MaxLength(10)
  private readonly pass_word: string;
}
