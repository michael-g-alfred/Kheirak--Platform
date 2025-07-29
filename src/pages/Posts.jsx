import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase"; // تأكد أن ملف firebase.js فيه export لـ db
import CreatePostTrigger from "../components/CreatePostTrigger";
import RequestForm from "../components/RequestForm";
import NoData from "../components/NoData";
import PostCard from "../components/PostCard";

export default function Posts() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleCloseForm = () => {
    setShowRequestForm(false);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Posts"));
        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [posts]);

  return (
    <>
      <CreatePostTrigger onClick={() => setShowRequestForm((prev) => !prev)} />

      {showRequestForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950/90 backdrop-blur-md z-50">
          <RequestForm onClose={handleCloseForm} />
        </div>
      )}

      <hr className="my-4 border-[var(--color-bg-divider)] border-.5 rounded" />

      {/* عرض الرسالة أو البوستات */}
      {loading ? (
        <p className="text-center text-gray-500 mt-8">جاري تحميل الطلبات...</p>
      ) : posts.length === 0 ? (
        <NoData h2={"لا توجد طلبات تبرع متاحة الآن"} />
      ) : (
        posts.map((post) => <PostCard key={post.id} newPost={post} />)
      )}
    </>
  );
}
