import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import Loader from "../components/Loader";
import NoData from "../components/NoData";
import CardLayout from "../layouts/CardLayout";
import CardsLayout from "../layouts/CardsLayout";
import UserInfo from "../components/UserInfo";

export default function OrgProfile() {
  const [myCoupons, setMyCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const userEmail = currentUser?.email;

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

      <hr className="my-4 border-[var(--color-bg-divider)] border-.5 rounded" />

      {isLoading ? (
        <Loader />
      ) : myCoupons.length === 0 ? (
        <NoData h2="لم تقم بإنشاء أي كوبون حتى الآن." />
      ) : (
        <CardsLayout colNum={1} fixedCol={2}>
          {myCoupons.map((coupon) => (
            <CardLayout key={coupon.id} title={coupon.title}>
              <div className="text-md text-[var(--color-bg-text)] space-y-1 text-right">
                <p>
                  <strong>الحالة:</strong> {coupon.status || "غير محددة"}
                </p>
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
              </div>
            </CardLayout>
          ))}
        </CardsLayout>
      )}
    </PageLayout>
  );
}
