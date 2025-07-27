import React from "react";

export default function CardLayout({ title, description }) {
  return (
    <div className="rounded-lg shadow p-6 border border-[var(--color-bg-divider)] hover:shadow-md transition-shadow duration-300 bg-[var(--color-bg-card)]">
      <h2 className="text-2xl font-semibold mb-2 text-[var(--color-primary-base)]">
        {title}
      </h2>
      {description && (
        <p className="text-base leading-relaxed text-[var(--color-bg-text)]">
          {description}
        </p>
      )}
    </div>
  );
}
