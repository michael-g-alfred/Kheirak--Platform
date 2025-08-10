import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import PageLayout from "../layouts/PageLayout";
import Carousel from "../components/Carousel";
import Posts from "./Posts"; // adjust the path if necessary

export default function Home() {
  const [activeTab, setActiveTab] = useState("posts");
  const location = useLocation();

  const navLinkBaseClass = "flex-1 p-6 font-semibold";
  const navLinkBaseStyle = {
    textAlign: "center",
  };

  return (
    <PageLayout>
      <div dir="rtl">
        <Carousel />
        <nav
          role="navigation"
          aria-label="التنقل بين الأقسام"
          className="flex my-6 rounded-lg overflow-hidden">
          <NavLink
            to="/posts"
            onClick={() => setActiveTab("posts")}
            className={navLinkBaseClass}
            style={{
              ...navLinkBaseStyle,
              backgroundColor:
                activeTab === "posts"
                  ? "var(--color-primary-base)"
                  : "var(--color-primary-disabled)",
              color:
                activeTab === "posts"
                  ? "var(--color-bg-text)"
                  : "var(--color-bg-muted-text)",
            }}
            aria-current={activeTab === "posts" ? "page" : undefined}>
            الطلبات
          </NavLink>
          <NavLink
            to="/coupons"
            onClick={() => setActiveTab("coupons")}
            className={navLinkBaseClass}
            style={{
              ...navLinkBaseStyle,
              backgroundColor:
                activeTab === "coupons"
                  ? "var(--color-primary-base)"
                  : "var(--color-primary-disabled)",
              color:
                activeTab === "coupons"
                  ? "var(--color-bg-text)"
                  : "var(--color-bg-muted-text)",
            }}
            aria-current={activeTab === "coupons" ? "page" : undefined}>
            الكوبونات
          </NavLink>
        </nav>
        <main role="main" aria-label="المحتوى الرئيسي">
          {location.pathname === "/" ? <Posts /> : <Outlet />}
        </main>
      </div>
    </PageLayout>
  );
}
