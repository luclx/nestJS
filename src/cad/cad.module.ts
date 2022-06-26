import { Module } from '@nestjs/common';
import { CADService } from './cad.service';
@Module({
  controllers: [],
  providers: [CADService],
  exports: [CADService]
})
export class CADModule { }
