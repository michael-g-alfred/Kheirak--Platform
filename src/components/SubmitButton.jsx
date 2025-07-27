import React from "react";
import Loader from "./Loader";

export default function SubmitButton({ buttonTitle, isLoading = false }) {
  return (
    <button
      type="submit"
      className="w-full text-[var(--color-secondary-base)] font-bold p-3 rounded-md transition cursor-pointer bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-hover)]">
      {isLoading ? <Loader /> : buttonTitle}
    </button>
  );
}
