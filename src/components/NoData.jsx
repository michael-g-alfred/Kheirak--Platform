import AlertIcon from "../icons/AlertIcon";

export default function NoData({ h2 }) {
  return (
    <div className="md:w-2/3 mx-auto rounded-lg p-4 text-center">
      <div className="flex justify-center text-2xl font-bold mb-3 text-[var(--color-bg-muted-text)]">
        <AlertIcon />
      </div>
      <h2 className="text-2xl font-bold mb-3 text-[var(--color-bg-muted-text)]">
        {h2}
      </h2>
    </div>
  );
}
