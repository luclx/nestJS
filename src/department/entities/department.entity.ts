import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'Department' })
export class Department extends AbstractEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;
}
