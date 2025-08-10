import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { toast } from "react-hot-toast";

export function useUpdateStatus(collectionName) {
  const [updatingId, setUpdatingId] = useState(null);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateDoc(doc(db, collectionName, id), { status });
      toast.success(`تم ${status === "مقبول" ? "قبول" : "رفض"} بنجاح`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`خطأ أثناء ${status === "مقبول" ? "قبول" : "رفض"}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return { updatingId, updateStatus };
}
