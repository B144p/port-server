import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { wakaTransformPayload, WakaUtil } from './utils';

@Injectable()
export class StatisticService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wakaUtil: WakaUtil,
  ) {}

  async getWakaDBData() {
    const existingData = await this.prisma.statistics.findFirst({
      include: {
        languages: {
          orderBy: { totalSeconds: 'desc' },
        },
        operatingSystems: {
          orderBy: { totalSeconds: 'desc' },
        },
        contributions: {
          orderBy: { date: 'asc' },
          take: 366,
        },
      },
    });

    const IsAlreadyFetchToday =
      existingData &&
      dayjs(existingData.lastFetch).isAfter(dayjs().startOf('day'));
    if (IsAlreadyFetchToday) return existingData;

    const { activity, languages, operatingSystems, contributions } =
      await this.wakaUtil.getWakaTime();

    const payloadLanguages = wakaTransformPayload.language(languages);
    const payloadOperatingSystems = wakaTransformPayload.os(operatingSystems);
    const payloadContributions = wakaTransformPayload.contribution(
      contributions.days,
    );

    const basePayload = {
      startDate: dayjs(activity.range.start).unix(),
      endDate: dayjs(activity.range.end).unix(),
      totalSeconds: activity.grand_total.total_seconds_including_other_language,
      humanReadable:
        activity.grand_total.human_readable_total_including_other_language,
      lastFetch: new Date(),
    };

    return this.prisma.statistics.upsert({
      where: { id: existingData?.id },
      create: {
        ...basePayload,
        languages: { create: payloadLanguages },
        operatingSystems: { create: payloadOperatingSystems },
        contributions: { create: payloadContributions },
      },
      update: {
        ...basePayload,
        languages: {
          deleteMany: {},
          create: payloadLanguages,
        },
        operatingSystems: {
          deleteMany: {},
          create: payloadOperatingSystems,
        },
        contributions: {
          deleteMany: {},
          create: payloadContributions,
        },
      },
      include: {
        languages: {
          orderBy: { totalSeconds: 'desc' },
        },
        operatingSystems: {
          orderBy: { totalSeconds: 'desc' },
        },
        contributions: {
          orderBy: { date: 'asc' },
          take: 366,
        },
      },
    });
  }
}
