export default function CardLayout({
  title,
  description,
  children,
  clampTitle = false,
}) {
  return (
    <article
      className="rounded-lg p-4 border border-[var(--color-bg-divider)] bg-[var(--color-bg-card)]"
      dir="rtl">
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
          className={`text-sm sm:text-base leading-relaxed text-[var(--color-bg-text)] mb-3 text-right ${
            clampTitle ? "line-clamp-2" : ""
          }`}>
          {description}
        </p>
      )}

      {children && <div className="mt-4">{children}</div>}
    </article>
  );
}
