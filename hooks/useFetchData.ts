import { firestore } from "@/config/firebase";
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

type Options = {
  enabled?: boolean;
};

const useFetchData = <T>(
  collectionName: string,
  constraints?: QueryConstraint[] | null,
  options: Options = {}
) => {
  const { enabled = true } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const unsubscribeRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!collectionName || !enabled || constraints === null) {
      setData([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      const base = collection(firestore, collectionName);
      const q =
        Array.isArray(constraints) && constraints.length > 0
          ? query(base, ...constraints)
          : query(base);

      setLoading(true);
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetched = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as T[];
          setData(fetched);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error("Error fetching data:", err);
          setError(err.message);
          setLoading(false);
        }
      );

      unsubscribeRef.current = unsubscribe;
      return () => {
        unsubscribeRef.current?.();
        unsubscribeRef.current = null;
      };
    } catch (e: any) {
      console.error("Query build error:", e);
      setError(e?.message ?? "Query error");
      setLoading(false);
    }
  }, [collectionName, enabled, constraints]);

  return { data, loading, error };
};

export default useFetchData;
