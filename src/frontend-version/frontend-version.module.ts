import { Module } from '@nestjs/common';
import { ViewModule } from 'src/view/view.module';
import { FrontendVersionController } from './frontend-version.controller';
import { FrontendVersionService } from './frontend-version.service';

@Module({
  imports: [ViewModule],
  controllers: [FrontendVersionController],
  providers: [FrontendVersionService],
})
export class FrontendVersionModule {}
