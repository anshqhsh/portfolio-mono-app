import BigNumber from 'bignumber.js';

/**
 * 통화별로 소수점 자리수와 버림 규칙에 맞게 숫자를 문자열로 변환합니다.
 * 소수점 이하가 모두 0이면 정수로만 반환합니다.
 * @param value 숫자 또는 문자열(숫자)
 * @param currency 통화 코드 (예: 'USD', 'BTC', 'ETH', 'KRW' 등)
 * @returns 포맷된 문자열
 */
export function formatCurrencyByRule(value: number | string, currency: string): string {
  const bn = new BigNumber(value);

  let formatted: string;

  if (currency === 'USD' || currency === 'USDT' || currency === 'KRW') {
    // 정수, 소수점 버림
    formatted = bn.integerValue(BigNumber.ROUND_FLOOR).toFixed(0);
  } else if (currency === 'BTC') {
    // 8자리까지, 버림
    formatted = bn.decimalPlaces(8, BigNumber.ROUND_FLOOR).toFixed(8);
  } else {
    // 기타(ETH, SOL 등): 4자리까지, 버림
    formatted = bn.decimalPlaces(4, BigNumber.ROUND_FLOOR).toFixed(4);
  }

  // 소수점 이하가 모두 0이면 소수점 이하 제거
  return formatted.includes('.')
    ? formatted.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '')
    : formatted;
}
