import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/authContext";
import CreatePostTrigger from "../components/CreatePostTrigger";
import PostForm from "../components/PostForm";
import NoData from "../components/NoData";
import PostCard from "../components/PostCard";
import CardsLayout from "../layouts/CardsLayout";
import Loader from "../components/Loader";
import Searchbar from "../components/Searchbar";
import Divider from "../components/Divider";

import { useFetchCollection } from "../hooks/useFetchCollection";

export default function Posts() {
  const { role, loading } = useAuth();
  const [showPostForm, setShowPostForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filterFn = (post) => post.status === "مقبول";

  const {
    data: posts,
    isLoading,
    error,
  } = useFetchCollection(["Posts"], filterFn);

  const handleCloseForm = () => {
    setShowPostForm(false);
  };

  if (role === "مستخدم" || role === null) return null;

  if (error) {
    toast.error("خطأ في جلب الطلبات");
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading || loading) {
    return <Loader />;
  }

  return (
    <div className="px-6">
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

        <Divider />

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
          {isLoading ? (
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
              <div className="text-center text-sm text-[var(--color-primary-base)]">
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
    </div>
  );
}
