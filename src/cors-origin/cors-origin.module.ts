import { Module } from '@nestjs/common';
import { CorsOriginController } from './cors-origin.controller';
import { CorsOriginService } from './cors-origin.service';

@Module({
  controllers: [CorsOriginController],
  providers: [CorsOriginService],
})
export class CorsOriginModule {}
