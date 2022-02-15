import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomInformationService } from './room-information.service';
import { CreateRoomInformationDto } from './dto/create-room-information.dto';
import { UpdateRoomInformationDto } from './dto/update-room-information.dto';

@Controller('room-information')
export class RoomInformationController {
  constructor(private readonly roomInformationService: RoomInformationService) {}

  @Post()
  create(@Body() createRoomInformationDto: CreateRoomInformationDto) {
    return this.roomInformationService.create(createRoomInformationDto);
  }

  @Get()
  findAll() {
    return this.roomInformationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomInformationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomInformationDto: UpdateRoomInformationDto) {
    return this.roomInformationService.update(+id, updateRoomInformationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomInformationService.remove(+id);
  }
}
