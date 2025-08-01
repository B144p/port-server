import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { WAKA_ENDPOINT } from '../constants/endpoints';
import {
  IWakaActivityResponse,
  IWakaContributionResponse,
  IWakaLanguageResponse,
  IWakaOSResponse,
} from '../interfaces';

@Injectable()
export class WakaUtil {
  constructor(private readonly http: HttpService) {}

  async getWakaTime(): Promise<{
    activity: IWakaActivityResponse['data'];
    languages: IWakaLanguageResponse['data'];
    operatingSystems: IWakaOSResponse['data'];
    contributions: IWakaContributionResponse;
  }> {
    const [
      {
        data: { data: activity },
      },
      {
        data: { data: languages },
      },
      {
        data: { data: operatingSystems },
      },
      { data: contributions },
    ] = await Promise.all([
      firstValueFrom(
        this.http.get<IWakaActivityResponse>(WAKA_ENDPOINT.ACTIVITY),
      ),
      firstValueFrom(
        this.http.get<IWakaLanguageResponse>(WAKA_ENDPOINT.LANGUAGES),
      ),
      firstValueFrom(this.http.get<IWakaOSResponse>(WAKA_ENDPOINT.OS)),
      firstValueFrom(
        this.http.get<IWakaContributionResponse>(WAKA_ENDPOINT.CONTRIBUTIONS),
      ),
    ]);

    return { activity, languages, operatingSystems, contributions };
  }
}
