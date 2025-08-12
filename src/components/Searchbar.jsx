import CloseIcon from "../icons/CloseIcon";
import SearchIcon from "../icons/SearchIcon";
import InputField from "./InputField";

export default function Searchbar({
  searchTerm,
  setSearchTerm,
  dir,
  containerAriaLabel,
  inputAriaLabel,
  placeholder = "Search...",
  ...props
}) {
  return (
    <div className="relative">
      <InputField
        id="search"
        placeholder={placeholder}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label={inputAriaLabel}
        {...props}
      />
      {searchTerm ? (
        <button
          type="button"
          onClick={() => setSearchTerm("")}
          aria-label="مسح البحث"
          className="absolute top-1/2 left-3 transform -translate-y-1/2 danger_Ghost">
          <CloseIcon />
        </button>
      ) : (
        <span className="absolute top-1/2 left-3 transform -translate-y-1/2 rounded-full text-[var(--color-bg-muted-text)]">
          <SearchIcon />
        </span>
      )}
    </div>
  );
}
