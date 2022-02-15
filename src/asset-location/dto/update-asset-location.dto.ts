import { PartialType } from '@nestjs/swagger';
import { CreateAssetLocationDto } from './create-asset-location.dto';

export class UpdateAssetLocationDto extends PartialType(CreateAssetLocationDto) {}
