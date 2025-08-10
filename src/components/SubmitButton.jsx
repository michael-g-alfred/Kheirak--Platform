import React from "react";
import Loader from "./Loader";

export default function SubmitButton({
  buttonTitle,
  isLoading = false,
  disabled = false,
}) {
  return (
    <button
      type="submit"
      className="w-full text-[var(--color-bg-text)] font-bold p-3 rounded-md transition cursor-pointer bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-hover)]
       disabled:cursor-not-allowed"
      disabled={disabled}>
      {isLoading ? <Loader borderColor="var(--color-bg-text)" /> : buttonTitle}
    </button>
  );
}
