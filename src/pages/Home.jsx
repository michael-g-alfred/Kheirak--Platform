import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import PageLayout from "../layouts/PageLayout";
import Carousel from "../components/Carousel";
import Posts from "./Posts"; // adjust the path if necessary

export default function Home() {
  const [activeTab, setActiveTab] = useState("posts");
  const location = useLocation();

  return (
    <PageLayout>
      <div dir="rtl">
        <Carousel />
        <nav
          role="navigation"
          aria-label="التنقل بين الأقسام"
          className="flex my-8 rounded-lg overflow-hidden">
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
            }}
            aria-current={activeTab === "posts" ? "page" : undefined}>
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
