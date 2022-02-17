import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AssetLocationService } from './asset-location.service';
import { CreateAssetLocationDto } from './dto/create-asset-location.dto';

@Controller({ path: 'asset-location', version: '1' })
export class AssetLocationController {
  constructor(private readonly service: AssetLocationService) { }

  @ApiBody({ type: CreateAssetLocationDto })
  @Post()
  create(@Body() createAssetLocationDto: CreateAssetLocationDto) {
    return this.service.create(createAssetLocationDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // const room = '01A-01-12'
    // return this.service.findOne({ room_number: room })
    return this.service.findOne(+id);
  }
}
