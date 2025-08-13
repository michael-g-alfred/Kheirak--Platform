import { useEffect } from "react";
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

export default function CampaignReview({ statusFilter = "الكل" }) {
  const { data: posts, loading, error } = useFetchCollection(["Campaigns"]);
  const { updatingId, updateStatus } = useUpdateStatus("Campaigns");

  useEffect(() => {
    if (error) {
      toast.error("خطأ أثناء تحميل الطلبات");
    }
  }, [error]);

  if (loading) {
    return <Loader />;
  }

  const filteredCampaigns =
    statusFilter === "الكل"
      ? posts
      : posts.filter((post) => post.status === statusFilter);

  const {
    currentData: currentCampaigns,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
  } = usePagination(filteredPosts, 6);
  return (
    <>
      {filteredPosts.length > 0 ? (
        <>
          <CardsLayout>
            {currentCampaigns.map((campaign) => (
              <DynamicCardLayout
                key={campaign.id}
                title={campaign.title}
                status={campaign.status}>
                <div className="text-md text-[var(--color-bg-text-dark)] space-y-1 text-right">
                  <p>
                    <strong>مقدم الطلب: </strong>{" "}
                    {campaign.submittedBy?.userName || "غير محدد"}
                  </p>
                  <p>
                    <strong>تفاصيل الطلب: </strong> {campaign.details}
                  </p>
                  <p>
                    <strong>المبلغ المطلوب: </strong> {campaign.amount}
                  </p>
                  <p>
                    <strong>المرفقات: </strong>
                    {campaign.attachedFiles ? (
                      Array.isArray(campaign.attachedFiles) ? (
                        <ul className="list-disc pr-4 space-y-1">
                          {campaign.attachedFiles.map((file, index) => (
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
                          href={campaign.attachedFiles}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-bg-muted-text)] break-all underline">
                          {campaign.attachedFiles}
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
                        campaign.status
                      )} w-full font-bold py-0.125 px-2 rounded`}>
                      {campaign.status}
                    </span>
                  </p>
                </div>

                {campaign.status !== "مكتمل" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => updateStatus(campaign.id, "مقبول")}
                      className="success px-6 py-3 rounded text-md focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-success-light)] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        campaign.status === "مقبول" ||
                        updatingId === campaign.id
                      }>
                      {updatingId === campaign.id ? <Loader /> : "قبول"}
                    </button>
                    <button
                      onClick={() => updateStatus(campaign.id, "مرفوض")}
                      className="danger px-6 py-3 rounded text-md focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-danger-light)] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        campaign.status === "مرفوض" ||
                        updatingId === campaign.id
                      }>
                      {updatingId === campaign.id ? <Loader /> : "رفض"}
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
