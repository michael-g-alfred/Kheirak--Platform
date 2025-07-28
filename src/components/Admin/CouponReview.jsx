import React, { useEffect, useState } from "react";
import CardLayout from "../../layouts/CardLayout";
import CardsLayout from "../../layouts/CardsLayout";

export default function CouponReview() {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    setCoupons([
      {
        id: 1,
        title: "كوبون طعام - 50 جنيه",
        quantity: 20,
        org: "جمعية الرحمة",
        status: "قيد المراجعة",
      },
      {
        id: 2,
        title: "كوبون خبز - 30 جنيه",
        quantity: 10,
        org: "جمعية الإحسان",
        status: "قيد المراجعة",
      },
      {
        id: 3,
        title: "كوبون خضروات - 40 جنيه",
        quantity: 15,
        org: "مؤسسة الخير",
        status: "قيد المراجعة",
      },
      {
        id: 4,
        title: "كوبون لحوم - 100 جنيه",
        quantity: 5,
        org: "مؤسسة عطاء",
        status: "قيد المراجعة",
      },
      {
        id: 5,
        title: "كوبون حليب - 25 جنيه",
        quantity: 8,
        org: "جمعية طعام للجميع",
        status: "قيد المراجعة",
      },
      {
        id: 6,
        title: "كوبون ملابس - 80 جنيه",
        quantity: 12,
        org: "جمعية الحياة",
        status: "قيد المراجعة",
      },
      {
        id: 7,
        title: "كوبون أدوات مدرسية - 60 جنيه",
        quantity: 7,
        org: "مؤسسة التعليم أولاً",
        status: "قيد المراجعة",
      },
      {
        id: 8,
        title: "كوبون دواء - 90 جنيه",
        quantity: 4,
        org: "مركز الشفاء الخيري",
        status: "قيد المراجعة",
      },
    ]);
  }, []);

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

  return (
    <CardsLayout colNum={4}>
      {coupons.map((coupon) => (
        <CardLayout key={coupon.id} title={`#${coupon.id} - ${coupon.title}`}>
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
  );
}
