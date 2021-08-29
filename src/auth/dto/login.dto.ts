import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric } from "class-validator";

export class LoginDto {
  @IsAlphanumeric()
  @ApiProperty()
  private readonly username:string;

  @IsAlphanumeric()
  @ApiProperty()
  private readonly password:string;
}