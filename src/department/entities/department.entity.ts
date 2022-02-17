import { AbstractEntity } from './../../common/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'Department' })
export class DepartmentEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 50 })
  name: string;
}
