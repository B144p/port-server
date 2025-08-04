import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAboutMeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  intro: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  bio?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  mission?: string;
}
