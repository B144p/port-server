import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  preview?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsBoolean()
  inProgress: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
