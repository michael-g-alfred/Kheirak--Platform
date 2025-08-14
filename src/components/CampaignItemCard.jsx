import ImageIcon from "../icons/ImageIcon";

const CampaignItemCard = ({ item, onSelect }) => (
  <div className="border border-[var(--color-primary-base)] rounded-lg shadow-sm bg-[var(--color-bg-card)] px-6 py-4 text-center flex flex-col items-center min-h-[20rem]">
    {item.image ? (
      <img
        src={item.image}
        alt={item.name}
        className="w-full sm:aspect-[4/3] md:aspect-[16/9] xl:aspect-[21/9] object-cover rounded-lg mb-4"
      />
    ) : (
      <div className="w-full sm:aspect-[4/3] md:aspect-[16/9] xl:aspect-[21/9] flex items-center justify-center bg-[var(--color-primary-disabled)] text-[var(--color-bg-muted-text)] rounded-lg mb-2">
        <ImageIcon size={48} />
      </div>
    )}
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
