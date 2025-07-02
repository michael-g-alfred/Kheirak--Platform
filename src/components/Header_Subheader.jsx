import React from "react";

export default function Header_Subheader({ h1, p, children }) {
  return (
    <>
      <h1 className="text-4xl font-bold mb-2 text-[var(--color-primary-base)]">
        {h1}
      </h1>
      <p className="text-lg mb-4 leading-relaxed text-[var(--color-bg-text)]">
        {p}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </>
  );
}
