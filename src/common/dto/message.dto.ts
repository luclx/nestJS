'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from './abstract.dto';

export class MessageDto extends AbstractDto {
	@ApiProperty()
    message: string;
}
