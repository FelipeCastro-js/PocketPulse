import { CurrencyCode } from "@/types";

export const SUPPORTED_CURRENCIES: CurrencyCode[] = ["USD", "COP"];

export const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  USD: "$",
  COP: "$",
};

export const CURRENCY_LOCALE: Record<CurrencyCode, string> = {
  USD: "en-US",
  COP: "es-CO",
};
