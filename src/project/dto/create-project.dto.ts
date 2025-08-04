import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  preview?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  logo?: string;

  @IsBoolean()
  @ApiProperty()
  inProgress: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty()
  tags?: string[];
}
