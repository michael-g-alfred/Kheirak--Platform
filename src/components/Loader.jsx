import React from "react";

export default function Loader() {
  return (
    <div className="w-full flex justify-center">
      <div className="text-[var(--color-bg-text)] font-bold">
        <span
          className={`inline-block w-5 h-5 border-2 border-t-transparent rounded-full animate-spin`}></span>{" "}
      </div>
    </div>
  );
}
