import AlertIcon from "../icons/AlertIcon";

export default function NoData({ h2 }) {
  return (
    <div
      className="md:w-2/3 mx-auto rounded-lg p-8 text-center"
      dir="rtl"
      role="status"
      aria-live="polite">
      <div
        className="flex justify-center text-[var(--color-bg-muted-text)]"
        aria-hidden="true">
        <AlertIcon />
      </div>
      <h2 className="text-xl font-semibold text-[var(--color-bg-muted-text)] leading-relaxed">
        {h2}
      </h2>
    </div>
  );
}
