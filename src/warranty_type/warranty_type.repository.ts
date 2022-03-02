import { EntityRepository, Repository } from 'typeorm';
import { WarrantyTypeEntity } from './entities/warranty_type.entity';

@EntityRepository(WarrantyTypeEntity)
export class WarrantyTypeRepository extends Repository<WarrantyTypeEntity> { }
