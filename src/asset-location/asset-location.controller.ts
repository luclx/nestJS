import { ApiBody } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssetLocationService } from './asset-location.service';
import { CreateAssetLocationDto } from './dto/create-asset-location.dto';

@Controller({ path: 'asset-location', version: '1' })
export class AssetLocationController {
  constructor(private readonly assetLocationService: AssetLocationService) { }

  @ApiBody({ type: CreateAssetLocationDto })
  @Post()
  create(@Body() createAssetLocationDto: CreateAssetLocationDto) {
    return this.assetLocationService.create(createAssetLocationDto);
  }

  @Get()
  findAll() {
    return this.assetLocationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetLocationService.findOne(+id);
  }
}
