import CloseIcon from "../icons/CloseIcon";
import InputField from "./InputField";

export default function Searchbar({ searchTerm, setSearchTerm, ...props }) {
  return (
    <div
      className="my-4 relative w-full"
      dir="rtl"
      role="search"
      aria-label="البحث في الطلبات">
      <InputField
        id="search"
        placeholder="ابحث عن اسم الطلب..."
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="حقل البحث في الطلبات"
        className="pr-10" // padding right to make space for button
        {...props}
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm("")}
          aria-label="مسح البحث"
          className="absolute top-1/2 left-3 transform -translate-y-1/2 danger_Outline rounded-full">
          <CloseIcon />
        </button>
      )}
    </div>
  );
}
