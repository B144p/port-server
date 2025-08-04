import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNumber()
  @ApiProperty()
  start_date: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  end_date?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty()
  descriptions?: string[];
}
