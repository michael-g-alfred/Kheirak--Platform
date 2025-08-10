export default function Divider({ ...props }) {
  return (
    <hr
      className="flex-grow my-4 border-[var(--color-bg-divider)] border-[0.5px] rounded"
      {...props}
    />
  );
}
