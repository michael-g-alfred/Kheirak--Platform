import React, { useEffect, useState } from "react";
import CardLayout from "../../layouts/CardLayout";
import CardsLayout from "../../layouts/CardsLayout";
import NoData from "../NoData";
import Loader from "../../components/Loader";

export default function CouponReview() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const snapshot = await getDocs(collection(db, "Coupons"));
      const fetchedCoupons = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedCoupons);
      setIsLoading(false);
      console.log(fetchedCoupons);
    } catch (error) {
      console.error("خطأ أثناء تحميل الكوبونات:", error);
      setIsLoading(false);
    }
  };

  const handleApprove = (id) => {
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon.id === id ? { ...coupon, status: "مقبول" } : coupon
      )
    );
  };

  const handleReject = (id) => {
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon.id === id ? { ...coupon, status: "مرفوض" } : coupon
      )
    );
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center text-[var(--color-bg-text)]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {coupons.length > 0 ? (
        <CardsLayout colNum={4}>
          {coupons.map((coupon) => (
            <CardLayout key={coupon.id} title={`${coupon.title}`}>
              <div className="text-md text-[var(--color-bg-text)] space-y-1 text-right">
                <p>
                  <strong>الكمية المتوفرة: </strong>
                  {coupon.quantity}
                </p>
                <p>
                  <strong>المؤسسة: </strong> {coupon.org}
                </p>
                <p>
                  <strong>الحالة: </strong> {coupon.status}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleApprove(coupon.id)}
                  className="success px-6 py-3 rounded text-md">
                  قبول
                </button>
                <button
                  onClick={() => handleReject(coupon.id)}
                  className="danger px-6 py-3 rounded text-md">
                  رفض
                </button>
              </div>
            </CardLayout>
          ))}
        </CardsLayout>
      ) : (
        <NoData h2={"لا توجد كوبونات متاحة الآن"} />
      )}
    </>
  );
}
