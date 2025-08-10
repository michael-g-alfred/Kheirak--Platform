import { useState, useEffect, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

export function useFetchCollection(
  collectionPath,
  filterFn = null,
  sortFn = null
) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use refs to store filterFn and sortFn to avoid re-running effect due to new references
  const filterFnRef = useRef(filterFn);
  const sortFnRef = useRef(sortFn);

  // Update refs if the functions change (optional)
  useEffect(() => {
    filterFnRef.current = filterFn;
  }, [filterFn]);

  useEffect(() => {
    sortFnRef.current = sortFn;
  }, [sortFn]);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, ...collectionPath),
      (snapshot) => {
        let fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (filterFnRef.current) {
          fetchedData = fetchedData.filter(filterFnRef.current);
        }

        if (sortFnRef.current) {
          fetchedData.sort(sortFnRef.current);
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
