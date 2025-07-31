import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import CreatePostTrigger from "../components/CreatePostTrigger";
import RequestForm from "../components/RequestForm";
import NoData from "../components/NoData";
import PostCard from "../components/PostCard";
import CardsLayout from "../layouts/CardsLayout";
import Loader from "../components/Loader";
import { useAuth } from "../context/authContext";

export default function Posts() {
  const { role, loading } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const handleCloseForm = () => {
    setShowRequestForm(false);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Posts"));
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
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [posts]);

  if (loading || role === null) return null;

  return (
    <>
      {role === "مستفيد" && (
        <CreatePostTrigger
          onClick={() => setShowRequestForm((prev) => !prev)}
        />
      )}

      {showRequestForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950/90 backdrop-blur-md z-50">
          <RequestForm onClose={handleCloseForm} />
        </div>
      )}
      <hr className="my-4 border-[var(--color-bg-divider)] border-.5 rounded" />
      {/* عرض الرسالة أو البوستات */}
      {loadingPosts ? (
        <div className="w-full flex justify-center items-center text-[var(--color-bg-text)]">
          <Loader />
        </div>
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
