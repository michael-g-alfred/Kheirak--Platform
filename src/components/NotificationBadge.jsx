import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import Loader from "./Loader";
import { useAuth } from "../context/authContext";
import { useFetchCollection } from "../hooks/useFetchCollection";
import useIsMobile from "../hooks/useIsMobile";

export default function NotificationBadge() {
  const { currentUser } = useAuth();
  const isMobile = useIsMobile();
  const prevCount = useRef(0);

  const {
    data: notifications,
    isLoading,
    error,
  } = useFetchCollection(
    currentUser?.email
      ? ["Notifications", currentUser.email, "user_Notifications"]
      : []
  );

  useEffect(() => {
    if (error) {
      toast.error("خطأ في جلب الإشعارات");
    }
  }, [error]);

  useEffect(() => {
    if (prevCount.current !== 0 && notifications.length > prevCount.current) {
      toast.success("وصلك إشعار جديد");
    }
    prevCount.current = notifications.length;
  }, [notifications.length]);

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
        notifications.length > 0 && (
          <span
            className={`absolute danger text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] ${
              isMobile ? "top-0.5 -left-6" : "-top-4 -left-4"
            }`}
            aria-label={`${notifications.length} إشعار جديد`}
            role="status">
            {notifications.length > 99 ? "99+" : notifications.length}
          </span>
        )
      )}
    </div>
  );
}
