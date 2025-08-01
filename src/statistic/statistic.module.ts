import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { WakaUtil } from './utils';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService, WakaUtil],
})
export class StatisticModule {}
