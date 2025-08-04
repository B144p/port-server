import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  company: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  role: string;

  @IsNumber()
  @ApiProperty()
  startDate: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  endDate?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty()
  responsibilities?: string[];
}
