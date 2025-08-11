import { useEffect } from "react";
import DynamicCardLayout from "../../layouts/DynamicCardLayout";
import CardsLayout from "../../layouts/CardsLayout";
import NoData from "../NoData";
import Loader from "../Loader";
import { toast } from "react-hot-toast";
import { useFetchCollection } from "../../hooks/useFetchCollection";
import { useUpdateStatus } from "../../hooks/useUpdateStatus";
import { getStatusColor } from "../../utils/statusUtils";

export default function PostReview({ statusFilter = "الكل" }) {
  const { data: posts, loading, error } = useFetchCollection(["Posts"]);
  const { updatingId, updateStatus } = useUpdateStatus("Posts");

  useEffect(() => {
    if (error) {
      toast.error("خطأ أثناء تحميل الطلبات");
    }
  }, [error]);

  if (loading) {
    return <Loader />;
  }

  const filteredPosts =
    statusFilter === "الكل"
      ? posts
      : posts.filter((post) => post.status === statusFilter);

  return (
    <>
      {filteredPosts.length > 0 ? (
        <CardsLayout>
          {filteredPosts.map((post) => (
            <DynamicCardLayout
              key={post.id}
              title={post.title}
              status={post.status}>
              <div className="text-md text-[var(--color-bg-text-dark)] space-y-1 text-right">
                <p>
                  <strong>مقدم الطلب: </strong>{" "}
                  {post.submittedBy?.userName || "غير محدد"}
                </p>
                <p>
                  <strong>تفاصيل الطلب: </strong> {post.details}
                </p>
                <p>
                  <strong>المبلغ المطلوب: </strong> {post.amount}
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
                              className="text-[var(--color-bg-muted-text)] break-all underline">
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
                        className="text-[var(--color-bg-muted-text)] break-all underline">
                        {post.attachedFiles}
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
                      post.status
                    )} w-full font-bold py-0.125 px-2 rounded`}>
                    {post.status}
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
      ) : (
        <NoData h2={"لا توجد طلبات متاحة الآن"} />
      )}
    </>
  );
}
