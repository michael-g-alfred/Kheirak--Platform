import React, { useState } from "react";
import PageLayout from "../layouts/PageLayout";

export default function NotFound() {
  const [hover, setHover] = useState(false);

  return (
    <PageLayout x="center" y="center">
      <h1 style={{ fontSize: "5rem" }}>😭</h1>
      <h2 style={{ fontSize: "2rem", color: "var(--color-bg-text)" }}>
        .404 - الصفحة غير موجودة
      </h2>
      <a
        href="/"
        style={{
          width: "20rem",
          textDecoration: "none",
          backgroundColor: hover
            ? "var(--color-primary-hover)"
            : "var(--color-primary-base)",
          color: "var(--color-secondary-base)",
          padding: "0.75rem 1.5rem",
          borderRadius: "8px",
          fontWeight: "bold",
          display: "inline-block",
          textAlign: "center",
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}>
        العودة إلى الصفحة الرئيسية
      </a>
    </PageLayout>
  );
}
