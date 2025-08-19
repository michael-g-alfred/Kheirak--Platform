import ImageIcon from "../icons/ImageIcon";

const SelectableCard = ({ item, active, onClick, children }) => (
  <div
    onClick={onClick}
    className={`flex flex-col justify-center items-center gap-2 rounded border border-[var(--color-bg-divider)] px-6 py-4 text-center text-sm font-bold cursor-pointer transition shadow-sm overflow-hidden ${
      active
        ? "bg-[var(--color-primary-base)] text-[var(--color-bg-text)] shadow-md"
        : "bg-[var(--color-bg-card)] text-[var(--color-bg-muted-text)]"
    }`}>
    {item.image ? (
      item.image.startsWith("http") ? (
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-50 object-cover opacity-20 rounded-lg overflow-hidden"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-5xl ">
          {item.image}
        </div>
      )
    ) : (
      <div className="w-full h-50 bg-[var(--color-bg-card-dark)] flex items-center justify-center text-[var(--color-bg-muted-text)] rounded-lg overflow-hidden">
        <ImageIcon size={48} />
      </div>
    )}
    <div className="relative z-10">
      <div className="text-lg">{item.name}</div>
      {children}
    </div>
  </div>
);

export default SelectableCard;
