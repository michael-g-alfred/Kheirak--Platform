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

export default function AdminDashboard() {
  const [lastUpdated, setLastUpdated] = useState(null);
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

          <hr className="my-6 border-[var(--color-bg-divider)] border-[0.5px] rounded" />

          <section aria-labelledby="posts-heading">
            <div className="flex flex-col items-start gap-2 mb-4">
              <h2
                id="posts-heading"
                className="text-xl font-semibold text-[var(--color-primary-base)]">
                مراجعة البوستات
              </h2>
              <p className="text-xs text-[var(--color-bg-muted-text)]">
                (آخر تحديث: {lastUpdated})
              </p>
            </div>
            <PostReview />
          </section>

          <hr className="my-6 border-[var(--color-bg-divider)] border-[0.5px] rounded" />

          <section aria-labelledby="coupons-heading">
            <div className="flex flex-col items-start gap-2 mb-4">
              <h2
                id="coupons-heading"
                className="text-xl font-semibold text-[var(--color-primary-base)]">
                مراجعة الكوبونات
              </h2>
              <p className="text-xs text-[var(--color-bg-muted-text)]">
                (آخر تحديث: {lastUpdated})
              </p>
            </div>
            <CouponReview />
          </section>
        </main>
      </div>
    </PageLayout>
  );
}
