import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateCorsOriginDto {
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://my-frontend.vercel.app' })
  url!: string;
}
