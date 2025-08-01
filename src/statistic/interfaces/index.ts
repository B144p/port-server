export interface IWakaActivityResponse {
  data: IWakaActivity;
}
export interface IWakaLanguageResponse {
  data: Array<IWakaLanguageDetail>;
}
export interface IWakaOSResponse {
  data: Array<IWakaOSDetail>;
}

export interface IWakaContributionResponse {
  days: Array<IWakaContributionDaily>;
  status: string;
  is_up_to_date: boolean;
  is_up_to_date_pending_future: boolean;
  is_stuck: boolean;
  is_already_updating: boolean;
  range: string;
  percent_calculated: number;
  writes_only: boolean;
  user_id: string;
  is_including_today: boolean;
  human_readable_range: string;
}

interface IWakaActivity {
  best_day: {
    date: string;
    text: string;
    total_seconds: number;
  };
  grand_total: {
    daily_average: number;
    daily_average_including_other_language: number;
    human_readable_daily_average: string;
    human_readable_daily_average_including_other_language: string;
    human_readable_total: string;
    human_readable_total_including_other_language: string;
    total_seconds: number;
    total_seconds_including_other_language: number;
  };
  range: {
    start: string;
    end: string;
    range: string;
    days_including_holidays: number;
    days_minus_holidays: number;
    holidays: number;
  };
}

interface IWakaLanguageDetail {
  name: string;
  percent: number;
  color: string;
  decimal: string;
  digital: string;
  hours: number;
  minutes: number;
  text: string;
  total_seconds: number;
}

interface IWakaOSDetail {
  name: string;
  percent: number;
  color: string;
  decimal: string;
  digital: string;
  hours: number;
  minutes: number;
  text: string;
  total_seconds: number;
}

interface IWakaContributionDaily {
  date: string;
  total: number;
  categories: Array<{
    name: 'Coding' | 'Code Reviewing' | 'Debugging';
    total: number;
  }>;
}
