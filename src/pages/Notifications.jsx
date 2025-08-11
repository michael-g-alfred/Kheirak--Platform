import { useState, useEffect } from "react";
import { db } from "../Firebase/Firebase";
import { toast } from "react-hot-toast";

import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import Loader from "../components/Loader";
import NoData from "../components/NoData";
import CardLayout from "../layouts/CardLayout";
import CardsLayout from "../layouts/CardsLayout";

import { useFetchCollection } from "../hooks/useFetchCollection";
import { getAuth } from "firebase/auth";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function NotificationsPage() {
  const [deleting, setDeleting] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  const {
    data: notifications,
    loading: loadingNotifications,
    error,
  } = useFetchCollection(
    user ? ["Notifications", user.email, "user_Notifications"] : []
  );

  useEffect(() => {
    if (error) {
      toast.error("خطأ في جلب الإشعارات");
    }
  }, [error]);

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

  return (
    <PageLayout>
      <div dir="rtl">
        <Header_Subheader
          h1="الإشعارات"
          p="هنا تجد كل الإشعارات المتعلقة بحسابك."
        />

        {notifications.length > 0 && !loadingNotifications && (
          <div className="flex justify-end mb-6">
            <button
              onClick={handleDeleteAll}
              disabled={deleting}
              className="w-full sm:w-auto px-6 py-2 danger_Outline rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-danger-light)] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="حذف جميع الإشعارات">
              {deleting ? (
                <Loader borderColor="var(--color-bg-text)" />
              ) : (
                "حذف كل الإشعارات"
              )}
            </button>
          </div>
        )}

        <main role="main" aria-label="قائمة الإشعارات">
          {loadingNotifications ? (
            <Loader />
          ) : notifications.length === 0 ? (
            <NoData h2="لا توجد إشعارات" />
          ) : (
            <CardsLayout colNum={1}>
              {notifications.map((notif) => (
                <CardLayout key={notif.id} title={notif.title || "إشعار"}>
                  <article className="text-md text-[var(--color-bg-text-dark)] space-y-1 text-right">
                    <p>{notif.message || "لا يوجد محتوى"}</p>
                    <time className="text-sm text-[var(--color-muted)] block">
                      {notif.timestamp
                        ? new Date(notif.timestamp).toLocaleString("ar-SA")
                        : "تاريخ غير محدد"}
                    </time>
                  </article>

                  {notif.imageUrl && (
                    <div className="pt-2 text-center">
                      <img
                        src={notif.imageUrl}
                        alt={notif.imageAlt || "صورة الإشعار"}
                        className="w-32 h-32 mx-auto rounded border"
                        loadingNotifications="lazy"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </CardLayout>
              ))}
            </CardsLayout>
          )}
        </main>
      </div>
    </PageLayout>
  );
}
