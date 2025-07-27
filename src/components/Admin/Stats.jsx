import React, { useEffect, useState } from "react";
import CardsLayout from "../../layouts/CardsLayout";
import Loader from "../Loader";

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
    setIsLoading(true);

    // محاكاة جلب البيانات من قاعدة البيانات
    setTimeout(() => {
      setStats({
        users: 124,
        donors: 87,
        orgs: 14,
        requests: 203,
        completedRequests: 160,
        pendingRequests: 43,
        offers: 38,
      });
      setLastUpdated(
        new Date().toLocaleString("ar-EG", {
          dateStyle: "full",
          timeStyle: "short",
        })
      );
      setIsLoading(false);
    }, 1000);
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
            icon: "👤",
            color: "green",
          },
          {
            title: "عدد المتبرعين",
            description: stats.donors,
            icon: "💰",
            color: "blue",
          },
          {
            title: "عدد المؤسسات",
            description: stats.orgs,
            icon: "🏢",
            color: "purple",
          },
          {
            title: "عدد الطلبات",
            description: stats.requests,
            icon: "📦",
            color: "gray",
          },
          {
            title: "عدد الطلبات المكتملة",
            description: stats.completedRequests,
            icon: "✅",
            color: "emerald",
          },
          {
            title: "عدد الطلبات الغير مكتملة",
            description: stats.pendingRequests,
            icon: "⏳",
            color: "red",
          },
          {
            title: "عدد العروض المتاحة",
            description: stats.offers,
            icon: "🎁",
            color: "yellow",
          },
        ]}
      />
      <p className="text-xs text-[var(--color-bg-text)] text-center mt-4">
        آخر تحديث: {lastUpdated}
      </p>
    </>
  );
}
