import { useState } from "react";
import { doc, updateDoc, db } from "../Firebase/Firebase";
import { toast } from "react-hot-toast";

export function useUpdateStatus(collectionName) {
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingStatus(id);
      await updateDoc(doc(db, collectionName, id), { status });
      toast.success(`تم ${status === "مقبول" ? "قبول" : "رفض"} بنجاح`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`خطأ أثناء ${status === "مقبول" ? "قبول" : "رفض"}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  return { updatingStatus, updateStatus };
}
