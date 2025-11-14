import { CURRENCY, CURRENCY_LOCALE } from "@/constants/currency";

export const formatMoney = (
  value: number,
  opts: Intl.NumberFormatOptions = {}
) =>
  new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...opts,
  }).format(value);

export const formatCOP = (value: number | string = 0) => {
  const n = Number(value || 0);
  return new Intl.NumberFormat("es-CO", {
    style: "decimal",
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
};

export const formatCOPWithSymbol = (value: number | string = 0) => {
  const n = Number(value || 0);
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
};
