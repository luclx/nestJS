'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, MaxLength, IsAlphanumeric } from 'class-validator';

export class CreateUserDto {
  @IsAlphanumeric()
  @ApiProperty()
  @MaxLength(10)
  private readonly _user_name: string;
  public get user_name(): string {
    return this._user_name;
  }

  @IsInt({ message: 'age should a number.' })
  @ApiProperty()
  @MaxLength(3)
  readonly age: number;
}
