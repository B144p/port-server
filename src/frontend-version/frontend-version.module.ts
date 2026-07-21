import { Module } from '@nestjs/common';
import { FrontendVersionController } from './frontend-version.controller';
import { FrontendVersionService } from './frontend-version.service';

@Module({
  controllers: [FrontendVersionController],
  providers: [FrontendVersionService],
})
export class FrontendVersionModule {}
