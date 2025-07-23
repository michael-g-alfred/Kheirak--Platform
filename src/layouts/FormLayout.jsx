export default function FormLayout({ children, formTitle }) {
  return (
    <div className="w-full sm:w-2/3 lg:w-1/3 mx-auto rounded-lg shadow p-6 border border-[var(--color-bg-divider)] bg-[var(--color-bg-card)]">
      <h2 className="text-2xl font-bold mb-6 text-center text-[var(--color-primary-base)]">
        {formTitle}
      </h2>
      {children}
    </div>
  );
}
