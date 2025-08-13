const SelectableCard = ({ item, active, onClick, children }) => (
  <div
    onClick={onClick}
    className={`flex flex-col justify-center items-center rounded border border-[var(--color-bg-divider)] px-6 py-4 text-center text-sm font-bold cursor-pointer transition shadow-sm ${
      active
        ? "bg-[var(--color-primary-base)] text-[var(--color-bg-text)] shadow-md"
        : "bg-[var(--color-bg-card)] text-[var(--color-bg-muted-text)]"
    }`}>
    <div className="text-lg">{item.name}</div>
    {children}
  </div>
);

export default SelectableCard;
