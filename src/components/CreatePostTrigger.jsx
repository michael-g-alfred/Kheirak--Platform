export default function CreatePostTrigger({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg p-6 shadow-xs cursor-pointer bg-[var(--color-bg-card)] text-[var(--color-primary-base)] border border-[var(--color-bg-divider)] text-right
        hover:bg-opacity-70 transition duration-300 ease-in-out"
      type="button"
      aria-label={`إنشاء ${title}`}>
      <p className="text-lg">{title}</p>
    </button>
  );
}
