// categories for coupons
export const categories = [
  { name: "الكل", icon: "📦" },
  { name: "طعام", icon: "🍔" },
  { name: "كشوفات", icon: "🥼" },
  { name: "خصومات", icon: "🏷️" },
  { name: "ملابس", icon: "👕" },
  { name: "كهرباء", icon: "💡" },
  { name: "خدمات", icon: "🛠️" },
  { name: "تعليم", icon: "🎓" },
];

// options for copon form
export const categoryOptions = categories
  .filter((cat) => cat.name !== "الكل")
  .map((cat) => ({ value: cat.name, label: cat.name }));
