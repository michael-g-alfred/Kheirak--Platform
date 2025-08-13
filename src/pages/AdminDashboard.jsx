import { useState, useEffect } from "react";
import Stats from "../components/Admin/Stats";
import PostReview from "../components/Admin/PostReview";
import CouponReview from "../components/Admin/CouponReview";
import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import UserInfo from "../components/UserInfo";
import Divider from "../components/Divider";
import ReviewSection from "../components/Admin/ReviewSection";

export default function AdminDashboard() {
  const statusOptions = [
    { value: "الكل", label: "الكل" },
    { value: "قيد المراجعة", label: "قيد المراجعة" },
    { value: "مقبول", label: "مقبول" },
    { value: "مرفوض", label: "مرفوض" },
    { value: "مكتمل", label: "مكتمل" },
  ];

  const [lastUpdated, setLastUpdated] = useState(null);

  // حالات الفلترة
  const [filterPostsOpen, setFilterPostsOpen] = useState(false);
  const [postStatusFilter, setPostStatusFilter] = useState("الكل");

  const [filterCouponsOpen, setFilterCouponsOpen] = useState(false);
  const [couponsStatusFilter, setCouponsStatusFilter] = useState("الكل");

  const [filterCampaignsOpen, setFilterCampaignsOpen] = useState(false);
  const [campaignStatusFilter, setCampaignStatusFilter] = useState("الكل");

  // حالات الرؤية
  const [postsShow, setPostsShow] = useState(true);
  const [couponsShow, setCouponsShow] = useState(true);
  const [campaignsShow, setCampaignsShow] = useState(true);

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
            <Stats />
          </section>

          <Divider />

          {/* آخر تحديث */}
          <div className="py-2 mb-6 bg-[var(--color-bg-card)] border border-[var(--color-bg-divider)] rounded text-center text-[var(--color-primary-base)] text-sm">
            آخر تحديث: {lastUpdated}
          </div>

          {/* قسم مراجعة البوستات */}
          <ReviewSection
            id="posts"
            title="مراجعة البوستات"
            filterOpen={filterPostsOpen}
            setFilterOpen={setFilterPostsOpen}
            statusFilter={postStatusFilter}
            setStatusFilter={setPostStatusFilter}
            statusOptions={statusOptions}
            ReviewComponent={PostReview}
            show={postsShow}
            setShow={setPostsShow}
          />

          <Divider />

          {/* قسم مراجعة الكوبونات */}
          <ReviewSection
            id="coupons"
            title="مراجعة الكوبونات"
            filterOpen={filterCouponsOpen}
            setFilterOpen={setFilterCouponsOpen}
            statusFilter={couponsStatusFilter}
            setStatusFilter={setCouponsStatusFilter}
            statusOptions={statusOptions}
            ReviewComponent={CouponReview}
            show={couponsShow}
            setShow={setCouponsShow}
          />

          <Divider />

          {/* قسم مراجعة الحملات */}
          <ReviewSection
            id="campaigns"
            title="مراجعة الحملات"
            filterOpen={filterCampaignsOpen}
            setFilterOpen={setFilterCampaignsOpen}
            statusFilter={campaignStatusFilter}
            setStatusFilter={setCampaignStatusFilter}
            statusOptions={statusOptions}
            ReviewComponent={CouponReview}
            show={campaignsShow}
            setShow={setCampaignsShow}
          />
        </main>
      </div>
    </PageLayout>
  );
}
