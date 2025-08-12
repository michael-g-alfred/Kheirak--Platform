export default function PaginationControls({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}) {
  const buttonStyle =
    "flex items-center justify-center px-6 py-2 border-1 border-[var(--color-bg-divider)] text-[var(--color-primary-base)] font-bold rounded cursor-pointer disabled:bg-[var(--color-primary-disabled)] disabled:text-[var(--color-bg-muted-text)] disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex gap-2 justify-center items-center mt-4">
      <button
        disabled={currentPage === 1}
        onClick={onPrev}
        className={buttonStyle}>
        السابق
      </button>
      <span className="font-bold text-[var(--color-primary-base)]">
        {currentPage} / {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={onNext}
        className={buttonStyle}>
        التالي
      </button>
    </div>
  );
}
