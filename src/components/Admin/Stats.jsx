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
    coupons: 0,
    completedCoupons: 0,
    pendingCoupons: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, "Users"));
        const postsSnapshot = await getDocs(collection(db, "Posts"));
        const couponsSnapshot = await getDocs(collection(db, "Coupons"));

        const usersData = usersSnapshot.docs.map((doc) => doc.data());
        const postsData = postsSnapshot.docs.map((doc) => doc.data());
        const couponsData = couponsSnapshot.docs.map((doc) => doc.data());

        const users = usersData.filter((user) => user.role === "مستفيد").length;
        const donors = usersData.filter((user) => user.role === "متبرع").length;
        const orgs = usersData.filter((user) => user.role === "مؤسسة").length;
        const posts = postsData.length;
        const completedPosts = postsData.filter(
          (post) => post.status === "مكتمل"
        ).length;
        const pendingPosts = postsData.filter(
          (post) => post.status !== "مكتمل"
        ).length;
        const coupons = couponsData.length;
        const completedCoupons = couponsData.filter(
          (coupon) => coupon.status === "مكتمل"
        ).length;
        const pendingCoupons = couponsData.filter(
          (coupon) => coupon.status !== "مكتمل"
        ).length;

        setStats({
          users,
          donors,
          orgs,
          requests: posts,
          completedRequests: completedPosts,
          pendingRequests: pendingPosts,
          coupons,
          completedCoupons,
          pendingCoupons,
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

    fetchData();
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
            description: stats.users || "0",
          },
          {
            title: "عدد المتبرعين",
            description: stats.donors || "0",
          },
          {
            title: "عدد المؤسسات",
            description: stats.orgs || "0",
          },
          {
            title: "عدد الطلبات",
            description: stats.requests || "0",
          },
          {
            title: "عدد الطلبات المكتملة",
            description: stats.completedRequests || "0",
          },
          {
            title: "عدد الطلبات الغير مكتملة",
            description: stats.pendingRequests || "0",
          },
          {
            title: "عدد الكوبونات",
            description: stats.coupons || "0",
          },
          {
            title: "عدد الكوبونات المكتملة",
            description: stats.completedCoupons || "0",
          },
          {
            title: "عدد الكوبونات الغير مكتملة",
            description: stats.pendingCoupons || "0",
          },
        ]}
      />
      <p className="text-xs text-[var(--color-bg-text)] text-center mt-4">
        آخر تحديث: {lastUpdated}
      </p>
    </>
  );
}
