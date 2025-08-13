export default function PageLayout({ children, x = "start", y = "" }) {
  return (
    <div
      dir="rtl"
      className={`min-h-screen flex flex-col justify-${x} items-${y} gap-4 w-full mx-auto pt-24 p-4 md:p-4 lg:p-6 overflow-x-hidden`}>
      {children}
    </div>
  );
}
