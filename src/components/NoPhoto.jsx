import ImageIcon from "../icons/ImageIcon";

export default function NoPhoto() {
  return (
    <div className="w-16 h-16 rounded-full bg-[var(--color-primary-disabled)] border border-[var(--color-bg-divider)] flex items-center justify-center text-[var(--color-bg-text)] text-2xl hover:bg-[var(--color-primary-base)] hover:text-[var(--color-bg-text)]">
      <ImageIcon size={36} />
    </div>
  );
}
