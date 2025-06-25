import { ICurrency } from "@workspace/api";

/**
 * 유저의 잔고(balances)를 USD 기준으로 환산하여 합산합니다.
 */
export function calculateUserDepositUSD(
  balances?: Record<string, number>,
  currencies?: ICurrency[]
): number {
  if (!balances || !currencies) return 0;

  const priceMap = new Map(currencies.map((c) => [c.id, Number(c.price)]));

  // 유저의 잔고를 돌아 조건에 따라 환산하여 합산
  return Object.entries(balances).reduce((total = 0, [currency, amountStr]) => {
    const amount = Number(amountStr);
    // USD, USDT는 변환 없이 더함
    if (currency === "USD" || currency === "USDT") {
      return total + amount;
    }
    // 그 외 통화는 환율을 곱해서 USD로 변환
    // 환율 정보가 없는 통화는 무시
    const currencyPrice = priceMap.get(currency);
    if (currencyPrice === undefined) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`환율 정보가 없는 통화: ${currency}`);
      }
      return total;
    }

    return total + amount * currencyPrice;
  }, 0);
}
