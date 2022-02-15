import { IsAlphanumeric, MaxLength, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAssetLocationDto {
  @IsNumber()
  @ApiProperty()
  private readonly building_id: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  private readonly parent_id: number

  @IsString()
  @MaxLength(200)
  private readonly room_number: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  private readonly slug_name: string

  @IsString()
  @MaxLength(200)
  @IsOptional()
  private readonly room_name: string

  @IsString()
  @MaxLength(255)
  @IsOptional()
  private readonly adsk_object_id: string

  @IsString()
  @MaxLength(255)
  @IsOptional()
  private readonly adsk_urn: string

  @IsString()
  @MaxLength(255)
  @IsOptional()
  private readonly adsk_mep_urn: string
}
