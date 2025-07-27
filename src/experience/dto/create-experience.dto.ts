import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsNumber()
  startDate: number;

  @IsNumber()
  @IsOptional()
  endDate?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  responsibilities?: string[];
}
