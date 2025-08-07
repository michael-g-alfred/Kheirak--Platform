export default function FormLayout({ children, formTitle }) {
  return (
    <div className="w-full max-w-screen-sm mx-auto rounded-lg shadow p-4 sm:p-6 lg:p-8 border border-[var(--color-bg-divider)] bg-[var(--color-bg-card)]">
      <h2 className="text-2xl font-bold mb-6 text-center text-[var(--color-primary-base)]">
        {formTitle}
      </h2>
      {children}
    </div>
  );
}
