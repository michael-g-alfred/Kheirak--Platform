import React from "react";
import CardsLayout from "../../layouts/CardsLayout";
import Loader from "../Loader";
import { useAdminStats } from "../../hooks/useAdminStats";

export default function Stats() {
  const { stats, isLoading } = useAdminStats();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <CardsLayout
        list={[
          { title: "عدد المستفيدين", description: stats.users || "0" },
          { title: "عدد المتبرعين", description: stats.donors || "0" },
          { title: "عدد المؤسسات", description: stats.orgs || "0" },
          { title: "عدد الطلبات", description: stats.requests || "0" },
          {
            title: "عدد الطلبات المكتملة",
            description: stats.completedRequests || "0",
          },
          {
            title: "عدد الطلبات الغير مكتملة",
            description: stats.pendingRequests || "0",
          },
          { title: "عدد الكوبونات", description: stats.coupons || "0" },
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
    </>
  );
}
