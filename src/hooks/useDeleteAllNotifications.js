import { useState } from "react";
import { db } from "../Firebase/Firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";

export function useDeleteAllNotifications(user) {
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAll = async () => {
    if (!user || deleting) return;

    const confirmDelete = window.confirm(
      "هل أنت متأكد أنك تريد حذف كل الإشعارات؟"
    );
    if (!confirmDelete) return;

    setDeleting(true);

    try {
      const notifRef = collection(
        db,
        "Notifications",
        user.email,
        "user_Notifications"
      );

      const snapshot = await getDocs(notifRef);

      if (snapshot.empty) {
        toast.info("لا توجد إشعارات لحذفها");
        setDeleting(false);
        return;
      }

      const deletions = snapshot.docs.map((docItem) =>
        deleteDoc(
          doc(db, "Notifications", user.email, "user_Notifications", docItem.id)
        )
      );

      await Promise.all(deletions);
      toast.success("تم حذف جميع الإشعارات بنجاح");
    } catch (error) {
      console.error("Error deleting notifications:", error);
      toast.error("خطأ في حذف الإشعارات");
    } finally {
      setDeleting(false);
    }
  };

  return { deleting, handleDeleteAll };
}
