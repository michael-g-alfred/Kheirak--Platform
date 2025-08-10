import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import Loader from "../components/Loader";
import NoData from "../components/NoData";
import DynamicCardLayout from "../layouts/DynamicCardLayout";
import CardsLayout from "../layouts/CardsLayout";
import UserInfo from "../components/UserInfo";
import Divider from "../components/Divider";

export default function OrgProfile() {
  const [myCoupons, setMyCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email;

  const getStatusColor = (status) => {
    switch (status) {
      case "مقبول":
        return "bg-green-500";
      case "مرفوض":
        return "bg-red-500";
      case "قيد المراجعة":
        return "bg-yellow-500";
      case "مكتمل":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  useEffect(() => {
    if (!userEmail) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "Coupons"),
      (querySnapshot) => {
        const submittedCoupons = [];

        querySnapshot.forEach((doc) => {
          const couponData = doc.data();
          if (couponData.submittedBy?.email === userEmail) {
            submittedCoupons.push({
              id: doc.id,
              ...couponData,
            });
          }
        });

        setMyCoupons(submittedCoupons);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching organization coupons:", error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userEmail]);

  return (
    <PageLayout>
      <Header_Subheader
        h1="ملف الكوبونات الخاصة بك"
        p="تعرف على كوبوناتك المصدّرة وقيمها وحالاتها."
      />

      {/* {معلومات المستخدم} */}
      <UserInfo />

      <Divider />

      {isLoading ? (
        <Loader />
      ) : myCoupons.length === 0 ? (
        <NoData h2="لم تقم بإنشاء أي كوبون حتى الآن." />
      ) : (
        <CardsLayout colNum={4}>
          {myCoupons.map((coupon) => (
            <DynamicCardLayout
              key={coupon.id}
              title={coupon.title}
              status={coupon.status}>
              <div className="text-md text-[var(--color-bg-text-dark)] space-y-1 text-right">
                <p>
                  <strong>عدد الكوبونات الكلي:</strong> {coupon.stock}
                </p>
                <p>
                  <strong>عدد المستخدم منها:</strong>{" "}
                  {coupon.totalCouponUsed || 0}
                </p>
                <p>
                  <strong>عدد المتبقي:</strong>{" "}
                  {(coupon.stock || 0) - (coupon.totalCouponUsed || 0)}
                </p>
                <p className="mt-4 w-full">
                  <strong>الحالة: </strong>
                  <span
                    className={`${getStatusColor(
                      coupon.status
                    )} w-full font-bold py-0.125 px-2 rounded`}>
                    {coupon.status}
                  </span>
                </p>
              </div>
            </DynamicCardLayout>
          ))}
        </CardsLayout>
      )}
    </PageLayout>
  );
}
