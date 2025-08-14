import { getStatusColor } from "../utils/statusUtils";
import { motion } from "framer-motion";

export default function DynamicCardLayout({
  title,
  children,
  clampTitle,
  status,
  delay = 0,
}) {
  return (
    <motion.article
      className={`relative rounded-lg p-4 border border-[var(--color-bg-divider)] bg-[var(--color-bg-card)] overflow-hidden`}
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}>
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
    </motion.article>
  );
}
