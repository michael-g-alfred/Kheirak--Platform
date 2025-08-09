import InputField from "./InputField";

export default function Searchbar({ searchTerm, setSearchTerm }) {
  return (
    <div className="my-4" dir="rtl" role="search" aria-label="البحث في الطلبات">
      <InputField
        id="search"
        placeholder="ابحث عن اسم الطلب..."
        type="text"
        value={searchTerm}
        register={{
          value: searchTerm,
          onChange: (e) => {
            setSearchTerm(e.target.value);
          },
        }}
        aria-label="حقل البحث في الطلبات"
      />
    </div>
  );
}
