import InputField from "./InputField";

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="my-4">
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
      />
    </div>
  );
}
