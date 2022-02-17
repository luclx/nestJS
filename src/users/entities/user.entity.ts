import { AbstractEntity } from './../../common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'User' })
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 50 })
  user_name: string;

  @Column({ type: 'text' })
  pass_word: string;

  @Column({ type: 'smallint' })
  age: number;
}
