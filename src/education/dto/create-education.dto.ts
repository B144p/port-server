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
  title: string;

  @IsNumber()
  start_date: number;

  @IsNumber()
  @IsOptional()
  end_date?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  descriptions?: string[];
}
