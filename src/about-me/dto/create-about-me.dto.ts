import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAboutMeDto {
  @IsString()
  @IsNotEmpty()
  intro: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  mission?: string;
}
