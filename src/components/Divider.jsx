export default function Divider({ flexGrow = false, ...props }) {
  return (
    <hr
      className={`my-4 border-[var(--color-bg-divider)] border-[0.5px] rounded ${
        flexGrow ? "flex-grow" : ""
      }`}
      {...props}
    />
  );
}
