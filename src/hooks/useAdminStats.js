import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

export function useAdminStats() {
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
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, isLoading };
}
