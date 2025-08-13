import { useState, useEffect, useRef } from "react";
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

  // Use refs to store filterFn to avoid re-running effect due to new references
  const filterFnRef = useRef(filterFn);

  // Update refs if the functions change (optional)
  useEffect(() => {
    filterFnRef.current = filterFn;
  }, [filterFn]);

  useEffect(() => {
    setIsLoading(true);
    const q = query(
      collection(db, ...collectionPath),
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
  }, [JSON.stringify(collectionPath)]);

  return { data, isLoading, error };
}
