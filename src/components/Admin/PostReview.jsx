import { useEffect, useState } from "react";
import CardLayout from "../../layouts/CardLayout";
import CardsLayout from "../../layouts/CardsLayout";
import NoData from "../NoData";
import Loader from "../Loader";
import toast from "react-hot-toast";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";

export default function PostReview() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

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
    } catch {
      toast.error(`خطأ أثناء ${status === "مقبول" ? "قبول" : "رفض"} الطلب`);
    } finally {
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
      ) : posts.length > 0 ? (
        <CardsLayout colNum={4}>
          {posts.map((post) => (
            <CardLayout key={post.id} title={`${post.title}`}>
              <div className="text-md text-[var(--color-bg-text)] space-y-1 text-right">
                <p>
                  <strong>المؤسسة: </strong> {post.submittedBy.userName}
                </p>
                <p>
                  <strong>الكمية المتوفرة: </strong> {post.amount}
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
                <p>
                  <strong>الحالة: </strong> {post.status}
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
                    قبول
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(post.id, "مرفوض")}
                    className="danger px-6 py-3 rounded text-md"
                    disabled={
                      post.status === "مرفوض" || updatingId === post.id
                    }>
                    رفض
                  </button>
                </div>
              )}
            </CardLayout>
          ))}
        </CardsLayout>
      ) : (
        <NoData h2={"لا توجد طلبات متاحة الآن"} />
      )}
    </>
  );
}
