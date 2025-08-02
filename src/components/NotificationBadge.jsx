import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { useAuth } from "../context/authContext";
import { toast } from "react-hot-toast";

export default function NotificationBadge() {
  const [notificationCount, setNotificationCount] = useState(0);
  const prevCount = useRef(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.email) return;

    const notifRef = collection(
      db,
      "Notifications",
      currentUser.email,
      "user_Notifications"
    );

    const unsubscribe = onSnapshot(notifRef, (snapshot) => {
      const userNotifs = snapshot.docs.filter((doc) => {
        const data = doc.data();
        return data?.userId === currentUser?.uid;
      });

      const totalCount = userNotifs.length;

      if (prevCount.current !== 0 && totalCount > prevCount.current) {
        toast.success("وصلك إشعار جديد");
      }

      prevCount.current = totalCount;
      setNotificationCount(totalCount);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="relative inline-block">
      <span>الإشعارات</span>
    </div>
  );
}
