import React from "react";

export default function CardLayout({
  title,
  description,
  children,
  clampTitle,
}) {
  return (
    <div className="rounded-lg p-6 border border-[var(--color-bg-divider)] bg-[var(--color-bg-card)]">
      <h2
        className={`text-2xl font-semibold mb-2 text-[var(--color-primary-base)] ${
          clampTitle ? "line-clamp-1" : ""
        }`}>
        {title}
      </h2>
      {description && (
        <p
          className={`text-base leading-relaxed text-[var(--color-bg-text)] ${
            clampTitle ? "line-clamp-1" : ""
          }`}>
          {description}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
