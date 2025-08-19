import { useState, useEffect, useRef, useMemo } from "react";
import {
  db,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "../Firebase/Firebase";

export function useFetchCollection(collectionPath, filterFn = null) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterFnRef = useRef(filterFn);
  useEffect(() => {
    filterFnRef.current = filterFn;
  }, [filterFn]);

  const memoizedPath = useMemo(
    () => [...collectionPath],
    [collectionPath.join("/")]
  );

  useEffect(() => {
    setIsLoading(true);
    const q = query(
      collection(db, ...memoizedPath),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (filterFnRef.current) {
          fetchedData = fetchedData.filter(filterFnRef.current);
        }

        setData(fetchedData);
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memoizedPath]);

  return { data, isLoading, error };
}
