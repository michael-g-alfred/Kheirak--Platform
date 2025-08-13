import { getStatusColor } from "../utils/statusUtils";

export default function DynamicCardLayout({
  title,
  children,
  clampTitle,
  status,
  delay = 0,
}) {
  return (
    <div
      className={`relative rounded-lg p-4 border border-[var(--color-bg-divider)] bg-[var(--color-bg-card)] overflow-hidden
        `}
      dir="rtl">
      {/* الشريط الجانبي */}
      <span
        className={`absolute top-0 left-0 h-full w-3 rounded-l ${getStatusColor(
          status
        )}`}
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
