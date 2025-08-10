import { useState, useEffect } from "react";

export default function DynamicCardLayout({
  title,
  children,
  clampTitle,
  status,
  delay = 0,
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div
      className={`relative rounded-lg p-4 border border-[var(--color-bg-divider)] bg-[var(--color-bg-card)] overflow-hidden
        `}
      dir="rtl"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}>
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
