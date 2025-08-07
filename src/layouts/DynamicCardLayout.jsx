export default function DynamicCardLayout({
  title,
  children,
  clampTitle,
  status,
}) {
  return (
    <div className="relative rounded-lg p-4 border border-[var(--color-bg-divider)] bg-[var(--color-bg-card)] overflow-hidden">
      {/* الشريط الجانبي */}
      <span
        className={`absolute top-0 left-0 h-full w-3 rounded-l ${
          status === "قيد المراجعة"
            ? "bg-yellow-500"
            : status === "مقبول"
            ? "bg-green-500"
            : status === "مرفوض"
            ? "bg-red-500"
            : status === "مكتمل"
            ? "bg-blue-500"
            : "bg-gray-300"
        }`}
      />
      <h2
        className={`text-2xl font-semibold mb-2 text-[var(--color-primary-base)] ${
          clampTitle ? "line-clamp-1" : ""
        }`}>
        {title}
      </h2>
      {children && <div>{children}</div>}
    </div>
  );
}
