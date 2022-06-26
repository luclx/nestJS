import { Controller } from "@nestjs/common";
import { Crud, CrudController } from '@nestjsx/crud';
import { DepartmentService } from './department.service';
import { DepartmentEntity } from './entities/department.entity';
@Crud({
  model: {
    type: DepartmentEntity
  }
})
@Controller("departments")
export class DepartmentController implements CrudController<DepartmentEntity> {
  constructor(public service: DepartmentService) { }
}