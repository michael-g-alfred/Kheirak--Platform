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

    const unsubscribe = onSnapshot(notifRef, (snapshot) => {
      const notifs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const sorted = notifs.sort((a, b) =>
        b.timestamp.localeCompare(a.timestamp)
      );
      setNotifications(sorted);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDeleteAll = async () => {
    if (!user) return;
    const confirmDelete = window.confirm(
      "هل أنت متأكد أنك تريد حذف كل الإشعارات؟"
    );
    if (!confirmDelete) return;

    const notifRef = collection(
      db,
      "Notifications",
      user.email,
      "user_Notifications"
    );
    const snapshot = await getDocs(notifRef);
    const deletions = snapshot.docs.map((docItem) =>
      deleteDoc(
        doc(db, "Notifications", user.email, "user_Notifications", docItem.id)
      )
    );
    await Promise.all(deletions);
    toast.success("تم حذف جميع الإشعارات بنجاح");
  };

  return (
    <PageLayout>
      <Header_Subheader
        h1="الإشعارات"
        p="هنا تجد كل الإشعارات المتعلقة بحسابك."
      />

      {notifications.length > 0 && !loading && (
        <div className="flex justify-end">
          <button
            onClick={handleDeleteAll}
            className="px-6 py-2 danger rounded">
            حذف كل الإشعارات
          </button>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : notifications.length === 0 ? (
        <NoData h2="لا توجد إشعارات" />
      ) : (
        <CardsLayout colNum={2} fixedCol={1}>
          {notifications.map((notif) => (
            <CardLayout key={notif.id} title={notif.title}>
              <div className="text-md text-[var(--color-bg-text)] space-y-1 text-right">
                <p>{notif.message}</p>
                <p className="text-sm text-[var(--color-muted)]">
                  {new Date(notif.timestamp).toLocaleString()}
                </p>
              </div>

              {notif.imageUrl && (
                <div className="pt-2 text-center">
                  <img
                    src={notif.imageUrl}
                    alt="QR Code"
                    className="w-32 h-32 mx-auto rounded border"
                  />
                </div>
              )}
            </CardLayout>
          ))}
        </CardsLayout>
      )}
    </PageLayout>
  );
}
