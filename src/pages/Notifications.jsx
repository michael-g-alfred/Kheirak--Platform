import { useEffect, useState } from "react";
import { db } from "../Firebase/Firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "react-hot-toast";

import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import Loader from "../components/Loader";
import NoData from "../components/NoData";
import CardLayout from "../layouts/CardLayout";
import CardsLayout from "../layouts/CardsLayout";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const notifRef = collection(
      db,
      "Notifications",
      user.email,
      "user_Notifications"
    );

    const unsubscribe = onSnapshot(
      notifRef,
      (snapshot) => {
        try {
          const notifs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const sorted = notifs.sort((a, b) => {
            const timestampA = a.timestamp || "";
            const timestampB = b.timestamp || "";
            return timestampB.localeCompare(timestampA);
          });
          setNotifications(sorted);
          setLoading(false);
        } catch (error) {
          console.error("Error processing notifications:", error);
          toast.error("خطأ في معالجة الإشعارات");
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error fetching notifications:", error);
        toast.error("خطأ في جلب الإشعارات");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleDeleteAll = async () => {
    if (!user || deleting) return;

    // Use toast for confirmation instead of window.confirm
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

        {notifications.length > 0 && !loading && (
          <div className="flex justify-end mb-6">
            <button
              onClick={handleDeleteAll}
              disabled={deleting}
              className="w-full sm:w-auto px-6 py-2 danger rounded text-center transition-all duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
          {loading ? (
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
