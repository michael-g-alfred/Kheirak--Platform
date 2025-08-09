import ArrowBadgeLeft from "../icons/ArrowBadgeLeft";

export default function BulletPoints({ content }) {
  return (
    <p className="flex items-center space-x-1 mb-1">
      <span className="text-[var(--color-primary-base)] bg-[var(--color-secondary-base)] border border-[var(--color-bg-divider)] p-0.5 rounded-full">
        <ArrowBadgeLeft />
      </span>
      <span>{content}</span>
    </p>
  );
}
