import { formatCOP } from "./money";

export const parseCOPInputToNumber = (text: string): number => {
  const onlyDigits = (text || "").replace(/\D+/g, "");
  if (!onlyDigits) return 0;
  return Number(onlyDigits);
};

export const maskCOPInput = (text: string) => {
  const raw = parseCOPInputToNumber(text);
  return {
    rawNumber: raw,
    formatted: formatCOP(raw),
  };
};
