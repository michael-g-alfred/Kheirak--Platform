import React from "react";

export default function PageLayout({ children }) {
  return (
    <div
      style={{
        direction: "rtl",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "4rem",
      }}>
      {children}
    </div>
  );
}
