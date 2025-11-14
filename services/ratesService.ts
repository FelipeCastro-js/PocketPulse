import { firestore } from "@/config/firebase";
import { CurrencyCode } from "@/types";
import { doc, getDoc } from "firebase/firestore";

export const getRates = async (): Promise<Record<CurrencyCode, number>> => {
  const ref = doc(firestore, "settings", "rates");
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return { USD: 1, COP: 4200 } as Record<CurrencyCode, number>;
  }
  const data = snap.data();
  return (data?.rates || { USD: 1, COP: 4200 }) as Record<CurrencyCode, number>;
};
