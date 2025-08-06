import React, { useState, useEffect } from "react";
import Stats from "../components/Admin/Stats";
import PostReview from "../components/Admin/PostReview";
import CouponReview from "../components/Admin/CouponReview";
import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

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
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <PageLayout>
      <Header_Subheader
        h1={"لوحة تحكم الأدمن"}
        p={
          "في هذه الصفحة يمكنك متابعة الإحصائيات العامة للنظام، مراجعة الطلبات المقدمة من المستفيدين، ومعاينة الكوبونات النشطة والتفاعل معها."
        }></Header_Subheader>
      <button
        onClick={handleLogout}
        className="self-end px-6 py-2 danger rounded">
        تسجيل الخروج
      </button>
      <Stats />
      <hr className="my-4 border-[var(--color-bg-divider)] border-.5 rounded" />
      <div className="flex flex-col items-start gap-2">
        <h2 className="text-xl font-semibold text-[var(--color-primary-base)]">
          مراجعة البوستات
        </h2>
        <p className="text-xs text-[var(--color-bg-text)]">
          (آخر تحديث: {lastUpdated})
        </p>
      </div>
      <PostReview />
      <hr className="my-4 border-[var(--color-bg-divider)] border-.5 rounded" />
      <div className="flex flex-col items-start gap-2">
        <h2 className="text-xl font-semibold text-[var(--color-primary-base)]">
          مراجعة الكوبونات
        </h2>
        <p className="text-xs text-[var(--color-bg-text)]">
          (آخر تحديث: {lastUpdated})
        </p>
      </div>
      <CouponReview />
    </PageLayout>
  );
}
