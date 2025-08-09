import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { useAuth } from "../context/authContext";
import { toast } from "react-hot-toast";
import Loader from "./Loader";

// Custom hook to detect mobile screen size
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

export default function NotificationBadge() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const prevCount = useRef(0);
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!currentUser?.email) {
      setIsLoading(false);
      return;
    }

    const notifRef = collection(
      db,
      "Notifications",
      currentUser.email,
      "user_Notifications"
    );

    const unsubscribe = onSnapshot(
      notifRef,
      (snapshot) => {
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
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
        toast.error("خطأ في جلب الإشعارات");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="relative inline-block" dir="rtl">
      <span>الإشعارات</span>
      {isLoading ? (
        <span
          className={`absolute ${
            isMobile ? "top-0.5 -left-6" : "-top-4 -left-4"
          } w-5 h-5 flex items-center justify-center`}
          aria-label="جاري تحميل الإشعارات">
          <Loader />
        </span>
      ) : (
        notificationCount > 0 && (
          <span
            className={`absolute danger text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] ${
              isMobile ? "top-0.5 -left-6" : "-top-4 -left-4"
            }`}
            aria-label={`${notificationCount} إشعار جديد`}
            role="status">
            {notificationCount > 99 ? "99+" : notificationCount}
          </span>
        )
      )}
    </div>
  );
}
