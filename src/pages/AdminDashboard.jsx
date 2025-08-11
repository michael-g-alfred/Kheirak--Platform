import { useState, useEffect } from "react";
import Stats from "../components/Admin/Stats";
import PostReview from "../components/Admin/PostReview";
import CouponReview from "../components/Admin/CouponReview";
import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { toast } from "react-hot-toast";
import UserInfo from "../components/UserInfo";
import Divider from "../components/Divider";
import InputField from "../components/InputField";
import FilterOffIcon from "../icons/FilterOffIcon";
import FilterIcon from "../icons/FilterIcon";

const statusOptions = [
  { value: "الكل", label: "الكل" },
  { value: "قيد المراجعة", label: "قيد المراجعة" },
  { value: "مقبول", label: "مقبول" },
  { value: "مرفوض", label: "مرفوض" },
  { value: "مكتمل", label: "مكتمل" },
];

export default function AdminDashboard() {
  const [lastUpdated, setLastUpdated] = useState(null);

  // حالات الفلترة
  const [filterPostsOpen, setFilterPostsOpen] = useState(false);
  const [postStatusFilter, setPostStatusFilter] = useState("الكل");

  const [filterCouponsOpen, setFilterCouponsOpen] = useState(false);
  const [couponStatusFilter, setCouponStatusFilter] = useState("الكل");

  const { currentUser, logout } = useAuth();

  useEffect(() => {
    setLastUpdated(
      new Date().toLocaleString("ar-EG", {
        dateStyle: "full",
        timeStyle: "short",
      })
    );
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("تم تسجيل الخروج بنجاح");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("خطأ في تسجيل الخروج");
    }
  };

  return (
    <PageLayout>
      <div dir="rtl">
        <Header_Subheader
          h1="لوحة تحكم الأدمن"
          p="في هذه الصفحة يمكنك متابعة الإحصائيات العامة للنظام، مراجعة الطلبات المقدمة من المستفيدين، ومعاينة الكوبونات النشطة والتفاعل معها."
        />

        <UserInfo info={false} />

        <main role="main" aria-label="لوحة تحكم الأدمن">
          <section aria-labelledby="stats-heading">
            <h2 id="stats-heading" className="sr-only">
              الإحصائيات العامة
            </h2>
            <Stats />
          </section>

          <Divider />

          {/* قسم مراجعة البوستات */}
          <section aria-labelledby="posts-heading">
            <div className="flex flex-col items-start gap-2 mb-2">
              <div className="flex items-center justify-between w-full">
                <h2
                  id="posts-heading"
                  className="text-xl font-semibold text-[var(--color-primary-base)]">
                  مراجعة البوستات
                </h2>

                {/* زرار فتح/غلق الفلتر */}
                <button
                  onClick={() => setFilterPostsOpen((prev) => !prev)}
                  aria-pressed={filterPostsOpen}
                  aria-label={
                    filterPostsOpen
                      ? "إغلاق فلتر البوستات"
                      : "فتح فلتر البوستات"
                  }
                  className="px-6 py-2 border border-[var(--color-primary-base)] rounded text-[var(--color-primary-base)] hover:bg-[var(--color-primary-hover)] hover:text-[var(--color-bg-text)] transition">
                  {filterPostsOpen ? <FilterOffIcon /> : <FilterIcon />}
                </button>
              </div>
              <p className="text-xs text-[var(--color-bg-muted-text)] mb-2">
                (آخر تحديث: {lastUpdated})
              </p>
            </div>

            {/* خيارات الفلترة باستخدام InputField */}
            {filterPostsOpen && (
              <div className="p-4 border border-[var(--color-bg-divider)] rounded bg-[var(--color-bg-card)]">
                <InputField
                  label="حالة البوستات"
                  id="postStatus"
                  select={true}
                  options={statusOptions}
                  value={postStatusFilter}
                  onChange={(e) => setPostStatusFilter(e.target.value)}
                />
              </div>
            )}

            <PostReview statusFilter={postStatusFilter} />
          </section>

          <Divider />

          {/* قسم مراجعة الكوبونات */}
          <section aria-labelledby="coupons-heading">
            <div className="flex flex-col items-start gap-2 mb-2">
              <div className="flex items-center justify-between w-full">
                <h2
                  id="coupons-heading"
                  className="text-xl font-semibold text-[var(--color-primary-base)]">
                  مراجعة الكوبونات
                </h2>

                {/* زرار فتح/غلق فلتر الكوبونات */}
                <button
                  onClick={() => setFilterCouponsOpen((prev) => !prev)}
                  aria-pressed={filterCouponsOpen}
                  aria-label={
                    filterCouponsOpen
                      ? "إغلاق فلتر الكوبونات"
                      : "فتح فلتر الكوبونات"
                  }
                  className="px-6 py-2 border border-[var(--color-primary-base)] rounded text-[var(--color-primary-base)] hover:bg-[var(--color-primary-hover)] hover:text-[var(--color-bg-text)] transition">
                  {filterCouponsOpen ? <FilterOffIcon /> : <FilterIcon />}
                </button>
              </div>
              <p className="text-xs text-[var(--color-bg-muted-text)] mb-2">
                (آخر تحديث: {lastUpdated})
              </p>
            </div>

            {/* خيارات فلترة الكوبونات باستخدام InputField */}
            {filterCouponsOpen && (
              <div className="p-4 border border-[var(--color-bg-divider)] rounded bg-[var(--color-bg-card)]">
                <InputField
                  label="حالة الكوبونات"
                  id="couponStatus"
                  select={true}
                  options={statusOptions}
                  value={couponStatusFilter}
                  onChange={(e) => setCouponStatusFilter(e.target.value)}
                />
              </div>
            )}

            <CouponReview statusFilter={couponStatusFilter} />
          </section>
        </main>
      </div>
    </PageLayout>
  );
}
