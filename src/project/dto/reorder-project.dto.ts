import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class ReorderProjectDto {
  @IsInt()
  @Min(0)
  @ApiProperty({ description: 'Target position (0-based).' })
  order: number;
}
