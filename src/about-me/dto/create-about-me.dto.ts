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

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  displayName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  handle?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  role?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  location?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  avatar?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  resumeUrl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  availability?: string;
}
