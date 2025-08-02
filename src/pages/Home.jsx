import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import PageLayout from "../layouts/PageLayout";
import Header_Subheader from "../components/Header_Subheader";
import Posts from "./Posts"; // adjust the path if necessary

export default function Home() {
  const [activeTab, setActiveTab] = useState("posts");
  const location = useLocation();

  return (
    <PageLayout>
      <Header_Subheader
        h1="منصة التبرعات"
        p="مساعدة المحتاجين وتحقيق الخير في المجتمع."></Header_Subheader>
      <div
        className="flex mb-8 rounded-lg overflow-hidden"
        style={{ backgroundColor: "var(--color-secondary-base)" }}>
        <NavLink
          to="/posts"
          onClick={() => setActiveTab("posts")}
          className={`flex-1 p-6 font-semibold transition-all duration-200 hover:opacity-80`}
          style={{
            backgroundColor:
              activeTab === "posts"
                ? "var(--color-primary-base)"
                : "var(--color-secondary-base)",
            color:
              activeTab === "posts"
                ? "var(--color-secondary-base)"
                : "var(--color-bg-muted-text)",
            textAlign: "center",
          }}>
          الطلبات
        </NavLink>
        <NavLink
          to="/coupons"
          onClick={() => setActiveTab("coupons")}
          className={`flex-1 p-6 font-semibold transition-all duration-200 hover:opacity-80`}
          style={{
            backgroundColor:
              activeTab === "coupons"
                ? "var(--color-primary-base)"
                : "var(--color-secondary-base)",
            color:
              activeTab === "coupons"
                ? "var(--color-secondary-base)"
                : "var(--color-bg-muted-text)",
            textAlign: "center",
          }}>
          الكوبونات
        </NavLink>
      </div>
      <div>{location.pathname === "/" ? <Posts /> : <Outlet />}</div>
    </PageLayout>
  );
}
