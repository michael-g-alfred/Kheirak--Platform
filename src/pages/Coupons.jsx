import React from "react";
import AlertIcon from "../icons/AlertIcon";

export default function Coupons() {
  return (
    <div className="bg-[var(--color-bg-card)] rounded-2xl shadow-md p-6 border border-[var(--color-bg-divider)] hover:shadow-lg transition-all text-center">
      <div className="flex justify-center text-2xl font-bold mb-3 text-[var(--color-bg-muted-text)]">
        <AlertIcon />
      </div>
      <h2 className="text-2xl font-bold mb-3 text-[var(--color-bg-muted-text)]">
        لا توجد كوبونات متاحة الآن.
      </h2>
    </div>
  );
}
