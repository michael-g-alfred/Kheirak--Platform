import { useEffect } from "react";
import { toast } from "react-hot-toast";

import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import Loader from "../components/Loader";
import NoData from "../components/NoData";
import CardLayout from "../layouts/CardLayout";
import CardsLayout from "../layouts/CardsLayout";

import { useFetchCollection } from "../hooks/useFetchCollection";
import { getAuth } from "firebase/auth";
import { useDeleteAllNotifications } from "../hooks/useDeleteAllNotifications";

export default function NotificationsPage() {
  const auth = getAuth();
  const user = auth.currentUser;

  const {
    data: notifications,
    isLoading,
    error,
    sortFn: sortFnNotifications,
  } = useFetchCollection(
    user ? ["Notifications", user.email, "user_Notifications"] : []
  );

  // ترتيب الإشعارات حسب التاريخ (الأحدث أولًا)
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const { deleting, handleDeleteAll } = useDeleteAllNotifications(user);

  useEffect(() => {
    if (error) {
      toast.error("خطأ في جلب الإشعارات");
    }
  }, [error]);

  return (
    <PageLayout>
      <div dir="rtl">
        <Header_Subheader
          h1="الإشعارات"
          p="هنا تجد كل الإشعارات المتعلقة بحسابك."
        />

        {notifications.length > 0 && !isLoading && (
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
          {isLoading ? (
            <Loader />
          ) : notifications.length === 0 ? (
            <NoData h2="لا توجد إشعارات" />
          ) : (
            <CardsLayout colNum={1} smEnabled={false}>
              {sortedNotifications.map((notif) => (
                <CardLayout key={notif.id} title={notif.title || "إشعار"}>
                  <article className="text-md text-[var(--color-bg-text-dark)] space-y-1 text-right">
                    <p>{notif.message || "لا يوجد محتوى"}</p>
                    <time className="text-sm text-[var(--color-muted)] block">
                      {notif.timestamp
                        ? new Date(notif.timestamp).toLocaleString("ar-EG")
                        : "تاريخ غير محدد"}
                    </time>
                  </article>

                  {notif.imageUrl && (
                    <div className="pt-2 text-center">
                      <img
                        src={notif.imageUrl}
                        alt={notif.imageAlt || "صورة الإشعار"}
                        className="w-32 h-32 mx-auto rounded border"
                        loading="lazy"
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
