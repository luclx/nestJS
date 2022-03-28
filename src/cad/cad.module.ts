import { Module } from '@nestjs/common';
import { CADService } from './cad.service';
@Module({
  controllers: [],
  providers: [CADService]
})
export class CADModule { }
