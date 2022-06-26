import { Module } from '@nestjs/common';
import { FaultCategoryService } from './fault_category.service';
@Module({
  controllers: [],
  providers: [FaultCategoryService],
  exports: [FaultCategoryService]
})
export class FaultCategoryModule { }
 