import React from "react";

export default function SubmitButton({ buttonTitle }) {
  return (
    <button
      type="submit"
      className="w-full text-[var(--color-secondary-base)] font-bold p-3 rounded-md transition cursor-pointer bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-hover)]">
      {buttonTitle}
    </button>
  );
}
