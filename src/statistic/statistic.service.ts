import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { wakaTransformPayload, WakaUtil } from './utils';

const DEFAULT_EXCLUDED_LANGUAGES = ['JSON'];

@Injectable()
export class StatisticService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wakaUtil: WakaUtil,
  ) {}

  // Read-time projection over getWakaDBData — the DB cache stays canonical
  // and filter-independent, so a filtered request can never poison the
  // shared WakaTime day-cache for other callers.
  async getStatistics(exclude?: string[]) {
    const data = await this.getWakaDBData();
    const excludeList = exclude ?? DEFAULT_EXCLUDED_LANGUAGES;
    const excludedSet = new Set(
      excludeList.map((lang) => lang.trim().toLowerCase()),
    );

    const languages = data.languages.filter(
      (lang) => !excludedSet.has(lang.language.toLowerCase()),
    );
    const languagesTotalSeconds = languages.reduce(
      (sum, lang) => sum + lang.totalSeconds,
      0,
    );
    // Percent is an intra-set share, so it must be recomputed against the
    // filtered set or the remaining values no longer sum to 100. The
    // top-level totalSeconds/humanReadable are left untouched — those
    // answer "how much has he coded", not a property of the display filter.
    const rescaledLanguages = languages.map((lang) => ({
      ...lang,
      percent:
        languagesTotalSeconds > 0
          ? (lang.totalSeconds / languagesTotalSeconds) * 100
          : 0,
    }));

    return {
      ...data,
      languages: rescaledLanguages,
      languagesTotalSeconds,
      excluded: excludeList,
    };
  }

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
          orderBy: { date: 'desc' },
          take: 366,
        },
      },
    });

    const IsAlreadyFetchToday =
      existingData &&
      dayjs(existingData.lastFetch).isAfter(dayjs().startOf('day'));
    if (IsAlreadyFetchToday) {
      return {
        ...existingData,
        contributions: existingData.contributions.slice().reverse(),
      };
    }

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

    const result = await this.prisma.statistics.upsert({
      where: { id: existingData?.id ?? crypto.randomUUID() },
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
          orderBy: { date: 'desc' },
          take: 366,
        },
      },
    });

    return {
      ...result,
      contributions: result.contributions.slice().reverse(),
    };
  }
}
