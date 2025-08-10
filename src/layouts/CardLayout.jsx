import React, { useState, useEffect } from "react";

export default function CardLayout({
  title,
  description,
  children,
  clampTitle = false,
  delay = 0,
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <article
      className={`rounded-lg p-4 border border-[var(--color-bg-divider)] bg-[var(--color-bg-card)]`}
      dir="rtl"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}>
      {title && (
        <header>
          <h2
            className={`text-xl sm:text-2xl font-semibold mb-3 text-[var(--color-primary-base)] text-right ${
              clampTitle ? "line-clamp-1" : ""
            }`}>
            {title}
          </h2>
        </header>
      )}

      {description && (
        <p
          className={`text-sm sm:text-base leading-relaxed text-[var(--color-bg-text-dark)] mb-3 text-right ${
            clampTitle ? "line-clamp-2" : ""
          }`}>
          {description}
        </p>
      )}

      {children && <>{children}</>}
    </article>
  );
}
