export default function Divider({ flexGrow = false, my = 4, ...props }) {
  return (
    <hr
      className={`my-${my} border-[var(--color-bg-divider)] border-[0.5px] rounded ${
        flexGrow ? "flex-grow" : ""
      }`}
      {...props}
    />
  );
}
