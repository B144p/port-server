import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
} from 'class-validator';

export class CreateFrontendVersionDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'key must be lowercase alphanumeric with hyphens only',
  })
  @ApiProperty({ example: 'oscilloscope' })
  key: string;

  @IsUrl({ require_tld: false })
  @IsNotEmpty()
  @ApiProperty({ example: 'https://port-oscilloscope.vercel.app' })
  url: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  thumbnail?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Public listing visibility.' })
  show?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiProperty({ required: false })
  order?: number;
}
