export default function CreatePostTrigger({ title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl p-6 shadow-lg cursor-pointer hover:opacity-90 focus:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-base)] transition-all bg-[var(--color-bg-card)] text-right"
      type="button"
      aria-label={`إنشاء ${title}`}>
      <p className="text-lg text-[var(--color-bg-muted-text)]">{title}</p>
    </button>
  );
}
