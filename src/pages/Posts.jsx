import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { toast } from "react-hot-toast";

import { useAuth } from "../context/authContext";

import CreatePostTrigger from "../components/CreatePostTrigger";
import PostForm from "../components/PostForm";
import NoData from "../components/NoData";
import PostCard from "../components/PostCard";
import CardsLayout from "../layouts/CardsLayout";
import Loader from "../components/Loader";
import Searchbar from "../components/Searchbar";

export default function Posts() {
  const { role, loading } = useAuth();
  const [showPostForm, setShowPostForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCloseForm = () => {
    setShowPostForm(false);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Posts"),
      (snapshot) => {
        try {
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
        } catch (error) {
          console.error("Error processing posts:", error);
          toast.error("خطأ في معالجة الطلبات");
          setLoadingPosts(false);
        }
      },
      (error) => {
        console.error("Error fetching posts:", error);
        toast.error("خطأ في جلب الطلبات");
        setLoadingPosts(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading || role === null) return null;

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div dir="rtl">
      {role === "مستفيد" && (
        <CreatePostTrigger
          title="ما هو طلب التبرع اليوم؟"
          onClick={() => setShowPostForm((prev) => !prev)}
        />
      )}

      {showPostForm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-950/90 backdrop-blur-md z-50"
          role="dialog"
          aria-modal="true"
          aria-label="نموذج إضافة طلب جديد">
          <PostForm onClose={handleCloseForm} />
        </div>
      )}

      <hr className="my-4 border-[var(--color-bg-divider)] border-.5 rounded" />

      {/* شريط البحث */}
      {posts.length > 0 && (
        <div className="mb-6">
          <Searchbar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="ابحث في الطلبات..."
          />
        </div>
      )}

      <main role="main" aria-label="قائمة الطلبات">
        {loadingPosts ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : filteredPosts.length === 0 ? (
          <NoData
            h2={
              searchTerm
                ? "لا توجد طلبات تطابق كلمة البحث"
                : "لا توجد طلبات متاحة"
            }
          />
        ) : (
          <>
            <div className="text-center text-sm text-[var(--color-bg-muted-text)]">
              تم العثور على {filteredPosts.length} طلب{" "}
              {posts.length !== filteredPosts.length &&
                `من أصل ${posts.length}`}
            </div>
            <CardsLayout>
              {filteredPosts.map((post) => (
                <PostCard key={post.id} newPost={post} />
              ))}
            </CardsLayout>
          </>
        )}
      </main>
    </div>
  );
}
