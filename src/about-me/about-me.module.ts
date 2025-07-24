import { Module } from '@nestjs/common';
import { AboutMeService } from './about-me.service';
import { AboutMeController } from './about-me.controller';

@Module({
  controllers: [AboutMeController],
  providers: [AboutMeService],
})
export class AboutMeModule {}
