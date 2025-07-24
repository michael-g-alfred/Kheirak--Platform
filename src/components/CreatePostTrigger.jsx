export default function CreatePostTrigger({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl p-6 shadow-lg cursor-pointer hover:opacity-90 transition-all bg-[var(--color-bg-card)]">
      <p className="text-lg text-[var(--color-bg-muted-text)]">
        ما هو طلب التبرع اليوم؟
      </p>
    </div>
  );
}
