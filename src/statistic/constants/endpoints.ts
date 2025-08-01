// WakaTime
const WAKA_HOST = `https://wakatime.com/`;
const WAKA_SHARE_URL = `${WAKA_HOST}share/${process.env.WAKA_SHARE_ID}/`;

export const WAKA_ENDPOINT = {
  ACTIVITY: `${WAKA_SHARE_URL}${process.env.WAKA_SHARE_ACTIVITY_PATH}`,
  LANGUAGES: `${WAKA_SHARE_URL}${process.env.WAKA_SHARE_LANGUAGES_PATH}`,
  OS: `${WAKA_SHARE_URL}${process.env.WAKA_SHARE_OS_PATH}`,
  CONTRIBUTIONS: `${WAKA_SHARE_URL}${process.env.WAKA_SHARE_CONTRIBUTIONS_PATH}`,
};
