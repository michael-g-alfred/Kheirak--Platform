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

function PostReview({ statusFilter = "الكل" }) {
  const { data: posts, isLoading, error } = useFetchCollection(["Posts"]);
  const { updatingId, updateStatus } = useUpdateStatus("Posts");

  useEffect(() => {
    if (error) {
      toast.error("خطأ أثناء تحميل الطلبات");
    }
  }, [error]);

  const filteredPosts =
    statusFilter === "الكل"
      ? posts
      : posts.filter((post) => post.status === statusFilter);

  const {
    currentData: currentPosts,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
  } = usePagination(filteredPosts, 6);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {filteredPosts.length > 0 ? (
        <>
          <CardsLayout>
            {currentPosts.map((post) => (
              <DynamicCardLayout
                key={post.id}
                title={post.title}
                status={post.status}>
                <div className="text-md text-[var(--color-bg-text-dark)] space-y-1 text-right">
                  <p>
                    <strong>الجهة: </strong>{" "}
                    {post.submittedBy?.userName || "غير معرف"}
                  </p>
                  <p>
                    <strong>نوع الطلب: </strong> {post.type || "غير معرف"}
                  </p>
                  <p className="line-clamp-3">
                    <strong>تفاصيل الطلب: </strong> {post.details || "غير معرف"}
                  </p>
                  <p>
                    <strong>المبلغ المطلوب: </strong>{" "}
                    {post.amount != null ? post.amount : "غير معرف"}
                  </p>
                  <p>
                    <strong>المرفقات: </strong>
                    {post.attachedFiles ? (
                      Array.isArray(post.attachedFiles) ? (
                        <ul className="list-disc pr-4 space-y-1">
                          {post.attachedFiles.map((file, index) => (
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
                          href={post.attachedFiles}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all underline">
                          {post.attachedFiles}
                        </a>
                      )
                    ) : (
                      "غير معرف"
                    )}
                  </p>
                  <p className="mt-4 w-full">
                    <strong>الحالة: </strong>
                    <span
                      className={`${getStatusColor(
                        post.status
                      )} w-full font-bold py-0.125 px-2 rounded`}>
                      {post.status || "غير معرف"}
                    </span>
                  </p>
                </div>

                {post.status !== "مكتمل" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => updateStatus(post.id, "مقبول")}
                      className="success px-6 py-3 rounded text-md focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-success-light)] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        post.status === "مقبول" || updatingId === post.id
                      }>
                      {updatingId === post.id ? <Loader /> : "قبول"}
                    </button>
                    <button
                      onClick={() => updateStatus(post.id, "مرفوض")}
                      className="danger px-6 py-3 rounded text-md focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-danger-light)] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        post.status === "مرفوض" || updatingId === post.id
                      }>
                      {updatingId === post.id ? <Loader /> : "رفض"}
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
        <NoData h2={"لا توجد طلبات متاحة الآن"} />
      )}
    </>
  );
}

export default React.memo(PostReview);
