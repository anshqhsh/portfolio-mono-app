export const COINMARKETCAP_URL = 'https://coinmarketcap.com/currencies';

export const makeAssetsUrl = ({ ticker, name }: { ticker: string; name: string }): string => {
  if (ticker === 'BTC') {
    return 'bitcoin';
  }
  if (ticker === 'ETH') {
    return 'ethereum';
  }
  if (ticker === 'USDT') {
    return 'tether';
  }
  if (ticker === 'USDC') {
    return 'usd-coin';
  }
  return name.toLowerCase();
};
