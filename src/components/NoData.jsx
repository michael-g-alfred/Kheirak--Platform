import React from "react";
import AlertIcon from "../icons/AlertIcon";

export default function NoData({ h2 }) {
  return (
    <div className="md:w-2/3 mx-auto bg-[var(--color-bg-card)] rounded-lg shadow-md p-6 border border-[var(--color-bg-divider)] hover:shadow-lg transition-all text-center">
      <div className="flex justify-center text-2xl font-bold mb-3 text-[var(--color-bg-muted-text)]">
        <AlertIcon />
      </div>
      <h2 className="text-2xl font-bold mb-3 text-[var(--color-bg-muted-text)]">
        {h2}
      </h2>
    </div>
  );
}
