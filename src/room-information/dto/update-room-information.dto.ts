import { PartialType } from '@nestjs/swagger';
import { CreateRoomInformationDto } from './create-room-information.dto';

export class UpdateRoomInformationDto extends PartialType(CreateRoomInformationDto) {}
