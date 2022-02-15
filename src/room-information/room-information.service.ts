import { Injectable } from '@nestjs/common';
import { CreateRoomInformationDto } from './dto/create-room-information.dto';
import { UpdateRoomInformationDto } from './dto/update-room-information.dto';

@Injectable()
export class RoomInformationService {
  create(createRoomInformationDto: CreateRoomInformationDto) {
    return 'This action adds a new roomInformation';
  }

  findAll() {
    return `This action returns all roomInformation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} roomInformation`;
  }

  update(id: number, updateRoomInformationDto: UpdateRoomInformationDto) {
    return `This action updates a #${id} roomInformation`;
  }

  remove(id: number) {
    return `This action removes a #${id} roomInformation`;
  }
}
