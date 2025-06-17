import dayjs, { locale } from 'dayjs';

import utc from 'dayjs/plugin/utc';

import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko'; // 한국어 지원
import 'dayjs/locale/en'; // 영어 지원

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 주어진 날짜를 UTC 형식으로 변환하고 지정된 형식으로 문자열을 반환합니다.
 *
 * @param {string|Date|dayjs.Dayjs} date - 변환할 날짜입니다. 이 값은 `dayjs`가 처리할 수 있는 어떤 형식이든 될 수 있습니다.
 * @param {string} [format="MMM DD, YYYY"] - 날짜를 형식화하는데 사용될 문자열 형식입니다. 기본값은 "MMM DD, YYYY"입니다.
 * @param {string} [locale="en"] - 사용할 로케일입니다. 기본값은 "en"입니다.
 * @returns {string} 형식화된 날짜 문자열을 반환합니다.
 *
 * @example
 * // 기본 형식을 사용한 예시 ("MMM DD, YYYY")
 * console.log(formatUtcDate(new Date(2024, 0, 25)));
 * // 출력: "Jan 25, 2024"
 *
 * @example
 * // 사용자 정의 형식을 사용한 예시 ("YYYY-MM-DD")
 * console.log(formatUtcDate(new Date(2024, 0, 25), "YYYY-MM-DD"));
 * // 출력: "2024-01-25"
 */
export const formatUtcDate = (
  date: string,
  format: string = 'MMM DD, YYYY',
  locale: string = 'en',
) => {
  dayjs.locale(locale);
  return dayjs(date).utc().format(format);
};

/**
 * @param dateStr ISO 8601 date string
 * @returns formatted date string
 * @example ex) 2024-01-10T02:48:29.581Z -> 10 January 2024
 */
export const transformIsoToDateStr = (dateStr: string) => {
  // dateStr이 유효하지 않으면 오류 반환
  if (!dateStr || !dayjs(dateStr).isValid()) {
    return 'Invalid or missing date string';
  }
  return dayjs(dateStr).format('D MMMM YYYY');
};
