import { CURRENCY_LOCALE } from "@/constants/currency";
import { CurrencyCode } from "@/types";

export const formatMoney = (
  value: number,
  currency: CurrencyCode,
  opts: Intl.NumberFormatOptions = {}
) => {
  return new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "COP" ? 0 : 2,
    maximumFractionDigits: currency === "COP" ? 0 : 2,
    ...opts,
  }).format(value);
};

export const convertCurrency = (
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: Record<CurrencyCode, number>
) => {
  if (from === to) return amount;

  return amount * (rates[to] / rates[from]);
};
