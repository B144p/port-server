import dayjs from 'dayjs';
import {
  IWakaContributionResponse,
  IWakaLanguageResponse,
  IWakaOSResponse,
} from '../interfaces';

const wakaLanguageFormatPayload = (languages: IWakaLanguageResponse['data']) =>
  languages.map((lang) => ({
    language: lang.name,
    totalSeconds: lang.total_seconds,
    humanReadable: lang.text,
    percent: lang.percent,
  }));

const wakaOSFormatPayload = (operatingSystems: IWakaOSResponse['data']) =>
  operatingSystems.map((os) => ({
    os: os.name,
    totalSeconds: os.total_seconds,
    humanReadable: os.text,
    percent: os.percent,
  }));

const wakaContributionFormatPayload = (
  contributions: IWakaContributionResponse['days'],
) =>
  contributions.map((cont) => ({
    date: dayjs(cont.date).unix(),
    totalSeconds: cont.total,
  }));

export const wakaTransformPayload = {
  language: wakaLanguageFormatPayload,
  os: wakaOSFormatPayload,
  contribution: wakaContributionFormatPayload,
};
