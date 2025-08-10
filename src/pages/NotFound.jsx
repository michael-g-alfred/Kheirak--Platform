import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../layouts/PageLayout";

export default function NotFound() {
  const [hover, setHover] = useState(false);

  return (
    <PageLayout x="center" y="center">
      <div dir="rtl" className="text-center space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-primary-base)] mb-2">
            404
          </h1>
          <h2 className="text-2xl text-[var(--color-primary-base)] mb-6">
            الصفحة غير موجودة
          </h2>
          <p className="text-lg text-[var(--color-bg-muted-text)] mb-8 max-w-md mx-auto">
            عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. قد تكون الصفحة
            محذوفة أو تم تغيير الرابط.
          </p>
        </div>
        <Link
          to="/"
          className={`inline-block w-80 px-6 py-3 rounded-lg font-bold text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            hover ? "transform scale-105" : ""
          }`}
          style={{
            textDecoration: "none",
            backgroundColor: hover
              ? "var(--color-primary-hover)"
              : "var(--color-primary-base)",
            color: "var(--color-bg-text)",
          }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-label="العودة إلى الصفحة الرئيسية">
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </PageLayout>
  );
}
