/**
 * 퍼센트 숫자에 부호를 추가합니다. (이 서비스에서만 쓸거 같아서 따로 util package에 빼지 않음.)
 * @param value - 퍼센트 숫자
 * @returns 부호가 추가된 퍼센트 숫자
 */
export const formatPercentAddSymbol = (value: number, isSign = true) => {
  const sign = value >= 0 ? (isSign ? '+' : '') : '';
  return `${sign}${value.toFixed(2)}%`;
};
