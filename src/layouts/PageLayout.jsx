import React from "react";

export default function PageLayout({ children }) {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col gap-4 px-4 py-8 sm:px-8 md:px-16">
      {children}
    </div>
  );
}
