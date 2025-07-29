import React, { useEffect, useState } from "react";
import CardsLayout from "../../layouts/CardsLayout";
import Loader from "../Loader";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";

export default function Stats() {
  const [stats, setStats] = useState({
    users: 0,
    donors: 0,
    orgs: 0,
    requests: 0,
    completedRequests: 0,
    pendingRequests: 0,
    offers: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const postsSnapshot = await getDocs(collection(db, "Posts"));

        const usersData = usersSnapshot.docs.map((doc) => doc.data());
        const postsData = postsSnapshot.docs.map((doc) => doc.data());

        const users = usersData.filter((user) => user.role === "مستفيد").length;
        const donors = usersData.filter((user) => user.role === "متبرع").length;
        const orgs = usersData.filter((user) => user.role === "مؤسسة").length;
        const requests = postsData.length;
        const completedRequests = postsData.filter(
          (post) => post.status === "مكتمل"
        ).length;
        const pendingRequests = postsData.filter(
          (post) => post.status !== "مكتمل"
        ).length;
        const offers = 0; // يمكنك تغييره إذا كان هناك كولكشن للعروض

        setStats({
          users,
          donors,
          orgs,
          requests,
          completedRequests,
          pendingRequests,
          offers,
        });

        setLastUpdated(
          new Date().toLocaleString("ar-EG", {
            dateStyle: "full",
            timeStyle: "short",
          })
        );
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); // أول مرة

    const intervalId = setInterval(fetchData, 30000); // تحديث كل 30 ثانية

    return () => clearInterval(intervalId); // تنظيف عند الخروج
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="text-[var(--color-bg-text)] font-bold">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <>
      <CardsLayout
        colNum={4}
        list={[
          {
            title: "عدد المستفيدين",
            description: stats.users,
          },
          {
            title: "عدد المتبرعين",
            description: stats.donors,
          },
          {
            title: "عدد المؤسسات",
            description: stats.orgs,
          },
          {
            title: "عدد الطلبات",
            description: stats.requests,
          },
          {
            title: "عدد الطلبات المكتملة",
            description: stats.completedRequests,
          },
          {
            title: "عدد الطلبات الغير مكتملة",
            description: stats.pendingRequests,
          },
          {
            title: "عدد العروض المتاحة",
            description: stats.offers,
          },
        ]}
      />
      <p className="text-xs text-[var(--color-bg-text)] text-center mt-4">
        آخر تحديث: {lastUpdated}
      </p>
    </>
  );
}
