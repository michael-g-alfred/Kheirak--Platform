import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import CreatePostTrigger from "../components/CreatePostTrigger";
import PostForm from "../components/PostForm";
import NoData from "../components/NoData";
import PostCard from "../components/PostCard";
import CardsLayout from "../layouts/CardsLayout";
import Loader from "../components/Loader";
import { useAuth } from "../context/authContext";

export default function Posts() {
  const { role, loading } = useAuth();
  const [showPostForm, setShowPostForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const handleCloseForm = () => {
    setShowPostForm(false);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Posts"),
      (snapshot) => {
        const fetchedPosts = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => {
            const aDate = new Date(a.createdAt?.seconds * 1000 || 0);
            const bDate = new Date(b.createdAt?.seconds * 1000 || 0);
            return bDate - aDate;
          })
          .filter((post) => post.status === "مقبول");

        setPosts(fetchedPosts);
        setLoadingPosts(false);
      },
      (error) => {
        console.error("Error fetching posts:", error);
        setLoadingPosts(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading || role === null) return null;

  return (
    <>
      {role === "مستفيد" && (
        <CreatePostTrigger
          title={"ما هو طلب التبرع اليوم؟"}
          onClick={() => setShowPostForm((prev) => !prev)}
        />
      )}

      {showPostForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950/90 backdrop-blur-md z-50">
          <PostForm onClose={handleCloseForm} />
        </div>
      )}
      <hr className="my-4 border-[var(--color-bg-divider)] border-.5 rounded" />
      {/* عرض الرسالة أو البوستات */}
      {loadingPosts ? (
        <Loader />
      ) : posts.length === 0 ? (
        <NoData h2={"لا توجد طلبات تبرع متاحة الآن"} />
      ) : (
        <CardsLayout colNum={2}>
          {posts.map((post) => (
            <PostCard key={post.id} newPost={post} />
          ))}
        </CardsLayout>
      )}
    </>
  );
}
