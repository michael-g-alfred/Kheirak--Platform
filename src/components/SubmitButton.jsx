import Loader from "./Loader";

export default function SubmitButton({
  buttonTitle,
  isLoading = false,
  disabled = false,
  onClick = null,
}) {
  return (
    <button
      type="submit"
      className="w-full text-[var(--color-bg-text)] font-bold p-3 rounded-lg transition cursor-pointer bg-[var(--color-primary-base)] hover:bg-[var(--color-primary-hover)]
       disabled:cursor-not-allowed disabled:bg-[var(--color-primary-disabled)] disabled:text-[var(--color-bg-muted-text)] focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-primary-base)]"
      disabled={disabled}
      onClick={onClick}>
      {isLoading ? <Loader borderColor="var(--color-bg-text)" /> : buttonTitle}
    </button>
  );
}
