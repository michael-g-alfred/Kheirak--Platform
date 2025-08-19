import ImageIcon from "../icons/ImageIcon";

const CampaignItemCard = ({ item, onSelect }) => (
  <div className="border border-[var(--color-primary-base)] rounded-lg shadow-sm bg-[var(--color-bg-card)] px-6 py-4 text-center flex flex-col items-center min-h-[20rem]">
    <div className="relative w-full h-50 rounded-lg border border-[var(--color-bg-divider)] overflow-hidden">
      {item.image ? (
        <img
          src={item.image}
          alt="attachment"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-card-dark)] text-[var(--color-bg-muted-text)]">
          <ImageIcon size={48} />
        </div>
      )}
    </div>
    <div className="font-bold mb-1">{item.name}</div>
    <div className="font-md text-[var(--color-bg-text-dark)] text-sm mb-2">
      {item.description}
    </div>
    <div className="text-[var(--color-primary-base)] font-bold">
      {item.price} جنيه
    </div>
    <button
      onClick={() => onSelect(item)}
      className="w-full px-4 py-2 bg-[var(--color-primary-base)] text-[var(--color-bg-text)] rounded hover:bg-[var(--color-primary-hover)] mt-2">
      شراء كوبون
    </button>
  </div>
);

export default CampaignItemCard;
