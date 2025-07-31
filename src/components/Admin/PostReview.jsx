import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase/Firebase";
import CardLayout from "../../layouts/CardLayout";
import CardsLayout from "../../layouts/CardsLayout";
import NoData from "../NoData";
import Loader from "../../components/Loader";

export default function PostReview() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const snapshot = await getDocs(collection(db, "Posts"));
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
      setIsLoading(false);
      console.log(fetchedPosts);
    } catch (error) {
      console.error("خطأ أثناء تحميل البوستات:", error);
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const postRef = doc(db, "Posts", id);
      await updateDoc(postRef, { status: "مقبول" });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, status: "مقبول" } : post
        )
      );
    } catch (error) {
      console.error("خطأ في الموافقة على البوست:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const postRef = doc(db, "Posts", id);
      await updateDoc(postRef, { status: "مرفوض" });
      setPosts((prev) =>
        prev.map((post) =>
          post.id === id ? { ...post, status: "مرفوض" } : post
        )
      );
    } catch (error) {
      console.error("خطأ في رفض البوست:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center text-[var(--color-bg-text)]">
        <Loader />
      </div>
    );
  }

  return posts.length === 0 ? (
    <NoData h2={"لا توجد طلبات تبرع متاحة الآن"} />
  ) : (
    <CardsLayout colNum={4}>
      {posts.map((post) => (
        <CardLayout
          key={post.id}
          title={post.requestTitle}
          description={post.details || post.description}>
          <div className="text-sm text-[var(--color-bg-text)] space-y-1 text-right">
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
              <strong>المبلغ المطلوب: </strong>{" "}
              {post.requestedAmount || post.amount}
            </p>

            <p>
              <strong>الحالة: </strong>
              {post.status}
            </p>
          </div>

          {post.status !== "مكتمل" && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleApprove(post.id)}
                disabled={post.status === "مقبول"}
                className="success px-6 py-3 rounded text-md">
                قبول
              </button>
              <button
                onClick={() => handleReject(post.id)}
                disabled={post.status === "مرفوض"}
                className="danger px-6 py-3 rounded text-md">
                رفض
              </button>
            </div>
          )}
        </CardLayout>
      ))}
    </CardsLayout>
  );
}
