import { Controller, Get, Query } from '@nestjs/common';
import { QueryStatisticDto } from './dto/query-statistic.dto';
import { StatisticService } from './statistic.service';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get()
  getStatistics(@Query() query: QueryStatisticDto) {
    return this.statisticService.getStatistics(query.exclude);
  }
}
