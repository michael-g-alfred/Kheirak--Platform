export const getStatusColor = (status) => {
  switch (status) {
    case "مقبول":
      return "bg-[var(--color-success-light)] text-[var(--color-bg-text)]";
    case "مرفوض":
      return "bg-[var(--color-danger-light)] text-[var(--color-bg-text)]";
    case "قيد المراجعة":
      return "bg-[var(--color-warning-light)] text-[var(--color-bg-text)]";
    case "مكتمل":
      return "bg-blue-800 text-[var(--color-bg-text)]";
    default:
      return "bg-gray-800 text-[var(--color-bg-text)]";
  }
};
