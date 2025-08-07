import { useEffect, useState } from "react";
import DynamicCardLayout from "../../layouts/DynamicCardLayout";
import CardsLayout from "../../layouts/CardsLayout";
import NoData from "../NoData";
import Loader from "../Loader";
import toast from "react-hot-toast";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";

export default function CouponReview() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
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
    const unsubscribe = onSnapshot(
      collection(db, "Coupons"),
      (snapshot) => {
        const fetchedCoupons = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCoupons(fetchedCoupons);
        setIsLoading(false);
      },
      (error) => {
        toast.error("خطأ أثناء تحميل الكوبونات");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateDoc(doc(db, "Coupons", id), { status });
    } catch {
      toast.error(`خطأ أثناء ${status === "مقبول" ? "قبول" : "رفض"} الكوبون`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {coupons.length > 0 ? (
        <CardsLayout colNum={3}>
          {coupons.map((coupon) => (
            <DynamicCardLayout
              key={coupon.id}
              title={coupon.title}
              status={coupon.status}>
              <div className="text-md text-[var(--color-bg-text)] space-y-1 text-right">
                <p>
                  <strong>المؤسسة: </strong> {coupon.submittedBy.userName}
                </p>
                <p>
                  <strong>تفاصيل الكوبون: </strong> {coupon.details}
                </p>
                <p>
                  <strong>الكمية المتوفرة: </strong> {coupon.stock}
                </p>
                <p>
                  <strong>المرفقات: </strong>
                  {coupon.attachedFiles ? (
                    Array.isArray(coupon.attachedFiles) ? (
                      <ul className="list-disc pr-4 space-y-1">
                        {coupon.attachedFiles.map((file, index) => (
                          <li key={index}>
                            <a
                              href={file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--color-bg-muted-text)] break-all underline">
                              {file}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <a
                        href={coupon.attachedFiles}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-bg-muted-text)] break-all underline">
                        {coupon.attachedFiles}
                      </a>
                    )
                  ) : (
                    "لا يوجد"
                  )}
                </p>
                <p>
                  <strong>النوع: </strong> {coupon.type}
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

              {coupon.status !== "مكتمل" && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleUpdateStatus(coupon.id, "مقبول")}
                    className="success px-6 py-3 rounded text-md"
                    disabled={
                      coupon.status === "مقبول" || updatingId === coupon.id
                    }>
                    قبول
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(coupon.id, "مرفوض")}
                    className="danger px-6 py-3 rounded text-md"
                    disabled={
                      coupon.status === "مرفوض" || updatingId === coupon.id
                    }>
                    رفض
                  </button>
                </div>
              )}
            </DynamicCardLayout>
          ))}
        </CardsLayout>
      ) : (
        <NoData h2={"لا توجد كوبونات متاحة الآن"} />
      )}
    </>
  );
}
