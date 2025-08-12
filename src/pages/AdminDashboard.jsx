import { useState, useEffect } from "react";
import Stats from "../components/Admin/Stats";
import PostReview from "../components/Admin/PostReview";
import CouponReview from "../components/Admin/CouponReview";
import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
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

function ReviewSection({
  id,
  title,
  filterOpen,
  setFilterOpen,
  lastUpdated,
  statusFilter,
  setStatusFilter,
  statusOptions,
  ReviewComponent,
}) {
  return (
    <section aria-labelledby={`${id}-heading`}>
      <div className="flex flex-col items-start gap-2 mb-2">
        <div className="flex items-center justify-between w-full">
          <h2
            id={`${id}-heading`}
            className="text-xl font-semibold text-[var(--color-primary-base)]">
            {title}
          </h2>

          {/* زرار فتح/غلق الفلتر */}
          <button
            onClick={() => setFilterOpen((prev) => !prev)}
            aria-pressed={filterOpen}
            aria-label={
              filterOpen ? `إغلاق فلتر ${title}` : `فتح فلتر ${title}`
            }
            className="px-6 py-2 border border-[var(--color-primary-base)] rounded text-[var(--color-primary-base)] hover:bg-[var(--color-primary-hover)] hover:text-[var(--color-bg-text)] transition">
            {filterOpen ? <FilterOffIcon /> : <FilterIcon />}
          </button>
        </div>
        <p className="text-xs text-[var(--color-bg-muted-text)] mb-2">
          (آخر تحديث: {lastUpdated})
        </p>
      </div>

      {/* خيارات الفلترة باستخدام InputField */}
      {filterOpen && (
        <div className="p-4 border border-[var(--color-bg-divider)] rounded bg-[var(--color-bg-card)]">
          <InputField
            label={`حالة ${title}`}
            id={`${id}Status`}
            select={true}
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      )}

      <ReviewComponent statusFilter={statusFilter} />
    </section>
  );
}

export default function AdminDashboard() {
  const [lastUpdated, setLastUpdated] = useState(null);

  // حالات الفلترة
  const [filterPostsOpen, setFilterPostsOpen] = useState(false);
  const [postStatusFilter, setPostStatusFilter] = useState("الكل");

  const [filterCouponsOpen, setFilterCouponsOpen] = useState(false);
  const [couponStatusFilter, setCouponStatusFilter] = useState("الكل");

  useEffect(() => {
    setLastUpdated(
      new Date().toLocaleString("ar-EG", {
        dateStyle: "full",
        timeStyle: "short",
      })
    );
  }, []);

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
          <ReviewSection
            id="posts"
            title="مراجعة البوستات"
            filterOpen={filterPostsOpen}
            setFilterOpen={setFilterPostsOpen}
            lastUpdated={lastUpdated}
            statusFilter={postStatusFilter}
            setStatusFilter={setPostStatusFilter}
            statusOptions={statusOptions}
            ReviewComponent={PostReview}
          />

          <Divider />

          {/* قسم مراجعة الكوبونات */}
          <ReviewSection
            id="coupons"
            title="مراجعة الكوبونات"
            filterOpen={filterCouponsOpen}
            setFilterOpen={setFilterCouponsOpen}
            lastUpdated={lastUpdated}
            statusFilter={couponStatusFilter}
            setStatusFilter={setCouponStatusFilter}
            statusOptions={statusOptions}
            ReviewComponent={CouponReview}
          />
        </main>
      </div>
    </PageLayout>
  );
}
