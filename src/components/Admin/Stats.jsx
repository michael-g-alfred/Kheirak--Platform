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
          {
            title: "عدد المستفيدين",
            description: stats.users != null ? stats.users : "غير معرف",
          },
          {
            title: "عدد المتبرعين",
            description: stats.donors != null ? stats.donors : "غير معرف",
          },
          {
            title: "عدد المؤسسات",
            description: stats.orgs != null ? stats.orgs : "غير معرف",
          },
          {
            title: "عدد الطلبات",
            description: stats.requests != null ? stats.requests : "غير معرف",
          },
          {
            title: "عدد الطلبات المكتملة",
            description:
              stats.completedRequests != null
                ? stats.completedRequests
                : "غير معرف",
          },
          {
            title: "عدد الطلبات الغير مكتملة",
            description:
              stats.pendingRequests != null
                ? stats.pendingRequests
                : "غير معرف",
          },
          {
            title: "عدد الكوبونات",
            description: stats.coupons != null ? stats.coupons : "غير معرف",
          },
          {
            title: "عدد الكوبونات المكتملة",
            description:
              stats.completedCoupons != null
                ? stats.completedCoupons
                : "غير معرف",
          },
          {
            title: "عدد الكوبونات الغير مكتملة",
            description:
              stats.pendingCoupons != null ? stats.pendingCoupons : "غير معرف",
          },
        ]}
      />
    </>
  );
}
