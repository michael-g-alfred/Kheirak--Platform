// categories for coupons
export const categories = [
  "الكل",
  "طعام",
  "دواء",
  "ملابس",
  "كهرباء",
  "خدمات",
  "تعليم",
];
// icons for categories
export const categoryIcons = {
  الكل: "📦",
  طعام: "🍔",
  دواء: "💊",
  ملابس: "👕",
  كهرباء: "💡",
  خدمات: "🛠️",
  تعليم: "🎓",
};
// options for copon form
export const categoryOptions = categories
  .filter((cat) => cat !== "الكل")
  .map((cat) => ({ value: cat, label: cat }));
