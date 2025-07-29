export default function PageLayout({ children, x = "start", y = "" }) {
  return (
    <div
      dir="rtl"
      className={`min-h-screen flex flex-col justify-${x} items-${y} gap-4 w-full mx-auto p-4 md:p-6 lg:p-8 overflow-x-hidden`}>
      {children}
    </div>
  );
}
