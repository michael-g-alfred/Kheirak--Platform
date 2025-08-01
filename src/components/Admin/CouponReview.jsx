import { useEffect, useState } from "react";
import CardLayout from "../../layouts/CardLayout";
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

  const handleApprove = async (id) => {
    try {
      setUpdatingId(id);
      await updateDoc(doc(db, "Coupons", id), {
        status: "مقبول",
      });
      setUpdatingId(null);
    } catch (error) {
      toast.error("خطأ أثناء قبول الكوبون");
      setUpdatingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setUpdatingId(id);
      await updateDoc(doc(db, "Coupons", id), {
        status: "مرفوض",
      });
      setUpdatingId(null);
    } catch (error) {
      toast.error("خطأ أثناء رفض الكوبون");
      setUpdatingId(null);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="w-full flex justify-center py-8">
          <div className="text-[var(--color-bg-text)] font-bold">
            <Loader />
          </div>
        </div>
      ) : coupons.length > 0 ? (
        <CardsLayout colNum={4}>
          {coupons.map((coupon) => (
            <CardLayout key={coupon.id} title={`${coupon.title}`}>
              <div className="text-md text-[var(--color-bg-text)] space-y-1 text-right">
                <p>
                  <strong>المؤسسة: </strong> {coupon.submittedBy.userName}
                </p>
                <p>
                  <strong>الكمية المتوفرة: </strong>
                  {coupon.stock}
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
                  <strong>الحالة: </strong> {coupon.status}
                </p>
              </div>

              {coupon.status !== "مكتمل" && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleApprove(coupon.id)}
                    className="success px-6 py-3 rounded text-md"
                    disabled={
                      coupon.status === "مقبول" || updatingId === coupon.id
                    }>
                    قبول
                  </button>
                  <button
                    onClick={() => handleReject(coupon.id)}
                    className="danger px-6 py-3 rounded text-md"
                    disabled={
                      coupon.status === "مرفوض" || updatingId === coupon.id
                    }>
                    رفض
                  </button>
                </div>
              )}
            </CardLayout>
          ))}
        </CardsLayout>
      ) : (
        <NoData h2={"لا توجد كوبونات متاحة الآن"} />
      )}
    </>
  );
}
