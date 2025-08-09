import { useEffect, useState } from "react";
import DynamicCardLayout from "../../layouts/DynamicCardLayout";
import CardsLayout from "../../layouts/CardsLayout";
import NoData from "../NoData";
import Loader from "../Loader";
import { toast } from "react-hot-toast";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";

export default function PostReview() {
  const [posts, setPosts] = useState([]);
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
      collection(db, "Posts"),
      (snapshot) => {
        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
        setIsLoading(false);
      },
      (error) => {
        toast.error("خطأ أثناء تحميل الطلبات");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateDoc(doc(db, "Posts", id), { status });
      toast.success(`تم ${status === "مقبول" ? "قبول" : "رفض"} الطلب بنجاح`);
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error(`خطأ أثناء ${status === "مقبول" ? "قبول" : "رفض"} الطلب`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : posts.length > 0 ? (
        <CardsLayout>
          {posts.map((post) => (
            <DynamicCardLayout
              key={post.id}
              title={post.title}
              status={post.status}>
              <div className="text-md text-[var(--color-bg-text)] space-y-1 text-right">
                <p>
                  <strong>مقدم الطلب: </strong> {post.submittedBy?.userName || "غير محدد"}
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
                    onClick={() => handleUpdateStatus(post.id, "مقبول")}
                    className="success px-6 py-3 rounded text-md"
                    disabled={
                      post.status === "مقبول" || updatingId === post.id
                    }>
                    {updatingId === post.id ? <Loader /> : "قبول"}
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(post.id, "مرفوض")}
                    className="danger px-6 py-3 rounded text-md"
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
