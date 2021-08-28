'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
export class UserResponseDto {
  @IsString({ message: 'Username should a string.' })
  @ApiProperty()
  readonly user_name: string;

  @IsInt({ message: 'Password should a int.' })
  @ApiProperty()
  readonly age: number;
}
