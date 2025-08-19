import React, { useEffect } from "react";
import DynamicCardLayout from "../../layouts/DynamicCardLayout";
import CardsLayout from "../../layouts/CardsLayout";
import NoData from "../NoData";
import Loader from "../Loader";
import { toast } from "react-hot-toast";
import { useFetchCollection } from "../../hooks/useFetchCollection";
import { useUpdateStatus } from "../../hooks/useUpdateStatus";
import { getStatusColor } from "../../utils/statusUtils";
import { usePagination } from "../../hooks/usePagination";
import PaginationControls from "../PaginationControls";

function CouponReview({ statusFilter = "الكل" }) {
  const { data: coupons, isLoading, error } = useFetchCollection(["Coupons"]);
  const { updatingStatus, updateStatus } = useUpdateStatus("Coupons");

  useEffect(() => {
    if (error) {
      toast.error("خطأ أثناء تحميل الكوبونات");
    }
  }, [error]);

  const filteredCoupons =
    statusFilter === "الكل"
      ? coupons
      : coupons.filter((coupon) => coupon.status === statusFilter);

  const {
    currentData: currentCoupons,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
  } = usePagination(filteredCoupons, 6);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {filteredCoupons.length > 0 ? (
        <>
          <CardsLayout>
            {currentCoupons.map((coupon) => (
              <DynamicCardLayout
                key={coupon.id}
                title={coupon.title}
                status={coupon.status}>
                <div className="text-md text-[var(--color-bg-text-dark)] space-y-1 text-right">
                  <p>
                    <strong>الجهة: </strong>{" "}
                    {coupon.submittedBy?.userName || "غير محدد"}
                  </p>
                  <p>
                    <strong>نوع الكوبون: </strong> {coupon.type}
                  </p>
                  <p className="line-clamp-3">
                    <strong>تفاصيل الكوبون: </strong> {coupon.details}
                  </p>
                  <p>
                    <strong>عدد الكوبونات المتاحة:</strong> {coupon.stock}
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
                                className="break-all underline">
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
                          className="break-all underline">
                          {coupon.attachedFiles}
                        </a>
                      )
                    ) : (
                      "لا يوجد"
                    )}
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
                      onClick={() => updateStatus(coupon.id, "مقبول")}
                      className="success px-6 py-3 rounded text-md focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-success-light)] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        coupon.status === "مقبول" ||
                        updatingStatus === coupon.id
                      }>
                      {updatingStatus === coupon.id ? <Loader /> : "قبول"}
                    </button>
                    <button
                      onClick={() => updateStatus(coupon.id, "مرفوض")}
                      className="danger px-6 py-3 rounded text-md focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-danger-light)] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        coupon.status === "مرفوض" ||
                        updatingStatus === coupon.id
                      }>
                      {updatingStatus === coupon.id ? <Loader /> : "رفض"}
                    </button>
                  </div>
                )}
              </DynamicCardLayout>
            ))}
          </CardsLayout>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={prevPage}
            onNext={nextPage}
          />
        </>
      ) : (
        <NoData h2={"لا توجد كوبونات متاحة الآن"} />
      )}
    </>
  );
}

export default React.memo(CouponReview);
