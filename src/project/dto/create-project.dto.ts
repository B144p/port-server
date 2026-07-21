import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ProjectSourceDto } from './project-source.dto';

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectSourceDto)
  @IsOptional()
  @ApiProperty({ required: false, type: [ProjectSourceDto] })
  sources?: ProjectSourceDto[];
}
