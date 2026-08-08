import { ApiProperty } from '@nestjs/swagger';
import { ProjectStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
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

  @IsEnum(ProjectStatus)
  @ApiProperty({ enum: ProjectStatus })
  status: ProjectStatus;

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

  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiProperty({
    required: false,
    description:
      'Position to insert at (0-based). Omit to append. Inserting at an ' +
      'occupied position shifts existing projects at/after it down by one.',
  })
  order?: number;
}
