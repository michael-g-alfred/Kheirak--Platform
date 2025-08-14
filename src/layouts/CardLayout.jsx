import React from "react";
import { motion } from "framer-motion";

export default function CardLayout({
  title,
  description,
  children,
  clampTitle = false,
  delay = 0,
}) {
  return (
    <motion.article
      className={`rounded-lg p-4 border border-[var(--color-bg-divider)] bg-[var(--color-bg-card)]`}
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}>
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
    </motion.article>
  );
}
