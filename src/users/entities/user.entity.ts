'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'User' })
export class UserEntity extends AbstractEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 50 })
  user_name: string;

  @ApiProperty()
  @Column({ type: 'text' })
  pass_word: string;

  @ApiProperty()
  @Column({ type: 'smallint' })
  age: number;
}
